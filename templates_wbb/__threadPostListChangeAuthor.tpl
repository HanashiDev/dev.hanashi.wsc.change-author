{if $thread->canEditPost($post->getDecoratedObject()) && $__wcf->session->getPermission('mod.board.canChangeAuthor')}
	<li>
		<button class="button jsTooltip jsChangeAuthor" type="button" title="{lang}wcf.message.changeAuthor{/lang}" data-endpoint="{link controller='ChangeAuthor' application='wbb' object=$post}{/link}">
			{icon name='user'}
		</button>
	</li>
{/if}
