class Listener {
  constructor(playlistService, mailSender) {
    this._playlistService = playlistService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const content = message.content.toString();
      const { targetEmail, playlistId } = JSON.parse(content);

      const playlist = await this._playlistService.getPlaylist(playlistId);
      const result = await this._mailSender.sendEmail(
        targetEmail,
        JSON.stringify(playlist, null, 2)
      );

      console.log("[x] Received %s", JSON.stringify(result));
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
