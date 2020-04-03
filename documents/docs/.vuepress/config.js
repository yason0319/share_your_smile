module.exports = {
  title: 'Share Your Smile',
  themeConfig: {
		sidebar: [
			// 
			// '/',
			// グループ化したいリンク
			{
				// タイトル
				title: 'overview',
				// falseにすると常に開く
				collapsable: false,
				children: [
					'/overview/overview',
				]
			}
		],
		nav: [
      { text: 'Home', link: '/' },
      { text: '概要', link: '/overview/overview' }
    ]
  }
}