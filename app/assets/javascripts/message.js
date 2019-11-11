$("turbolinks:load", function(){
  function buildHTML(message){
    let image = (message.image.url !== null) ? `<img src=${message.image.url}>` : "";
    let html =
      `<div class="message-box" data-message-id="${message.id}">
        <div class="upper-message">
          <div class="upper-message__user-name">
            ${message.user_name}
          </div>
          <div class="upper-message__date">
            ${message.date}
          </div>
        </div>
        <div class="lower-message">
          <p class="lower-message__content">
            ${message.content}
          </p>
        </div>
        <div class="lower-message">
          ${image}
        </div>
      </div>`
    return html;
  };

  $(document).on('turbolinks:load', function(){
    $('#new_message').on('submit', function(e){
      e.preventDefault();
      let formData = new FormData(this);
      let url = $(this).attr('action');
      // $('form').removeAttr('data-disable-with');
      $.ajax({
        url: url,
        type: "POST",
        data: formData,
        dataType: 'json',
        processData: false,
        contentType: false,
      })
      .done(function(message){
        let html = buildHTML(message);
        $('.message').append(html);
        $('.message').animate({ scrollTop: $('.message')[0].scrollHeight}, 'fast');
        $('form')[0].reset();
      })
      .fail(function(){
        alert('error');
      });
      return false;
    });
  });

  let reloadMessages = function() {
    if (window.location.href.match(/\/groups\/\d+\/messages/)){
      let last_message_id = $('.message:last').data("message-id");

      $.ajax({
        url: 'api/messages',
        type: 'GET',
        dataType: 'json',
        data: {id: last_message_id}
      })
      .done(function(messages) {
        let insertHTML = '';
        messages.forEach(function (message) {
          insertHTML = buildHTML(message);
          $('messages').append(insertHTML);
        })
        // $('.message').animate({ scrollTop: $('.message')[0].scrollHeight}, 'fast');
      })
      .fail(function() {
        alert('error')
      });
    };
  };
  setInterval(reloadMessages, 5000);
});