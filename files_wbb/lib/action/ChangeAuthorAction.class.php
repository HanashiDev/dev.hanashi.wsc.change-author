<?php

namespace wbb\action;

use Laminas\Diactoros\Response\JsonResponse;
use LogicException;
use Override;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use wbb\data\post\Post;
use wbb\data\post\PostAction;
use wbb\data\post\PostEditor;
use wbb\data\thread\ThreadAction;
use wcf\data\user\User;
use wcf\http\Helper;
use wcf\system\exception\IllegalLinkException;
use wcf\system\exception\PermissionDeniedException;
use wcf\system\form\builder\field\user\UserFormField;
use wcf\system\form\builder\Psr15DialogForm;
use wcf\system\WCF;

final class ChangeAuthorAction implements RequestHandlerInterface
{
    #[Override]
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $parameters = Helper::mapQueryParameters(
            $request->getQueryParams(),
            <<<'EOT'
                array {
                    id: positive-int
                }
                EOT
        );

        $post = new Post($parameters['id']);
        if (!$post->postID) {
            throw new IllegalLinkException();
        }

        $thread = $post->getThread();
        if (!$thread->canEditPost($post) || !WCF::getSession()->getPermission('mod.board.canChangeAuthor')) {
            throw new PermissionDeniedException();
        }

        $form = $this->getForm($post);

        if ($request->getMethod() === 'GET') {
            return $form->toResponse();
        } elseif ($request->getMethod() === 'POST') {
            $response = $form->validateRequest($request);
            if ($response !== null) {
                return $response;
            }

            $data = $form->getData();
            $userID = $data['data']['userID'];
            $oldUser = new User($post->userID);
            $user = new User($userID);
            if (!$user->userID) {
                throw new IllegalLinkException();
            }

            $action = new PostAction([$post], 'update', [
                'data' => [
                    'userID' => $user->userID,
                    'username' => $user->username,
                ],
            ]);
            $action->executeAction();

            $threadData = [];
            if ($post->isFirstPost()) {
                $threadData = [
                    'userID' => $user->userID,
                    'username' => $user->username,
                ];
            }
            if ($thread->lastPostID == $post->postID) {
                $threadData['lastPosterID'] = $user->userID;
                $threadData['lastPoster'] = $user->username;
            }
            if ($threadData !== []) {
                $action = new ThreadAction([$thread], 'update', [
                    'data' => $threadData,
                ]);
                $action->executeAction();
            }

            if ($oldUser->userID) {
                PostEditor::updatePostCounter([$oldUser->userID => -1]);
            }
            PostEditor::updatePostCounter([$user->userID => 1]);

            return new JsonResponse([]);
        } else {
            throw new LogicException('Unreachable');
        }
    }

    private function getForm(Post $post): Psr15DialogForm
    {
        $form = new Psr15DialogForm(
            static::class,
            WCF::getLanguage()->get('wcf.message.changeAuthor')
        );

        $form->appendChildren([
            UserFormField::create('userID')
                ->label('wbb.thread.username')
                ->required(),
        ]);

        if ($post->postID) {
            $form->updatedObject($post, empty($_POST));
        }

        $form->build();

        return $form;
    }
}
