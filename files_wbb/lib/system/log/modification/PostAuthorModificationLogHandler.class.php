<?php

namespace wbb\system\log\modification;

use Override;
use wbb\data\modification\log\ViewablePostModificationLog;
use wbb\data\post\Post;
use wbb\data\post\PostList;
use wcf\system\log\modification\AbstractExtendedModificationLogHandler;

final class PostAuthorModificationLogHandler extends AbstractExtendedModificationLogHandler
{
    /**
     * @inheritDoc
     */
    protected $objectTypeName = 'dev.hanashi.wbb.post.author';

    public function changeAuthor(Post $post)
    {
        $this->createLog('changeAuthor', $post->postID, $post->threadID, []);
    }

    #[Override]
    public function getAvailableActions()
    {
        return [
            'changeAuthor',
        ];
    }

    #[Override]
    public function processItems(array $items)
    {
        $postIDs = [];
        /** @var ModificationLog $item */
        foreach ($items as $item) {
            $postIDs[] = $item->objectID;
        }

        $postList = new PostList();
        $postList->setObjectIDs($postIDs);
        $postList->readObjects();
        $posts = $postList->getObjects();

        foreach ($items as &$item) {
            $item = new ViewablePostModificationLog($item);
            if (isset($posts[$item->objectID])) {
                $item->setPost($posts[$item->objectID]);
            }
        }

        return $items;
    }
}
