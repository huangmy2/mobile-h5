function setAppShare (dqd_share_opt) {
  connectWebViewJavascriptBridge((bridge) => {
    bridge.callHandler('shareUrl', {
      is_immediately: dqd_share_opt.is_immediately || false,
      'is_showBtn': dqd_share_opt.is_showBtn || false,
      'is_picture': dqd_share_opt.is_picture || false,
      title: dqd_share_opt.title || '',
      content: dqd_share_opt.desc || '',
      url: dqd_share_opt.link || location.href
    });
  });
}

export {
  setAppShare
};
