<script data-relocate="true">
	require(["Hanashi/Change/Author"], ({ ChangeAuthor }) => {
		{jsphrase name='wcf.message.changeAuthor.success'}
		{jsphrase name='wcf.message.changeAuthor'}
		{capture assign='changeAuthorLink'}{link controller='ChangeAuthor' application='wbb'}{/link}{/capture}

		new ChangeAuthor('{unsafe:$changeAuthorLink|encodeJS}');
	});
</script>
