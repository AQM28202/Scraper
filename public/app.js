$(document).on("click", "#scrapeButton", () => {

    $.ajax({
      type: "GET",
      url: "/api/scrape"
    })
      .then(() => {
        $('.progress').remove();
      });
  });
  
  $(document).on("click", "#clearArticles", () => {
    $("#articles").empty();
    $("#articles").append("<h3>Press the scrape button to get new articles.</h3>")
    $("#articles").append("<h3>Click Load Articles to get previously scrapped articles.</h3>");
  });
  
  $(document).on("click", "#loadButton", () => {
    $('#wrapper').prepend(`
    <div class="progress pink lighten-2 mt">
      <div class="indeterminate"></div>
    </div>
        `);
  
    $.getJSON("/api/articles", function (data) {
      $("#articles").empty();
      data.forEach(e => {
  
        const $card = $("<div class='card hoverable s12'></div>");
  
        const $cardContent = $('<div>')
          .attr("class", "card-content")
          .attr("data-id", e._id);
  
        $cardContent.append([
          $('<div class="card-image"></div>').append($('<img>').attr("src", e.image)),
          $('<h3>').append($('<a>').attr("href", e.link).attr("target", "_blank").text(e.title)),
          $('<div class="card-content"></div>').append($('<p>').text(e.summary)),
          $('<div class="card-action" id="cardButtons"></div>')
            .append($("<a data-id='" + e._id + "' class='waves-effect waves-light btn pink lighten-2' id='addNote'><i class='material-icons left'>note_add</i>Add Note</a>"))
            .append($("<a data-id='" + e._id + "' class='waves-effect waves-light btn pink lighten-2' id='seeNote'><i class='material-icons left'>remove_red_eye</i>See Note</a>"))
            .append($("<a data-id='" + e._id + "' class='waves-effect waves-light btn pink lighten-2' id='deleteNote'><i class='material-icons left'>delete_forever</i>Delete Note</a>"))
        ]);
  
        $card.append($cardContent)
        $('.progress').remove();
        $("#articles").append($card);
      });
    })
  })
  
  
  $(document).on("click", "#addNote", function () {
    var thisId = $(this).attr("data-id");
  
    const $noteArea = $('<div class="card-content" id="noteArea"></div>')
      .append('<textarea id="noteInput"></textarea>')
      .append("<a data-id='" + thisId + "' class='waves-effect waves-light btn pink lighten-2' id='savenote'><i class='material-icons left'>save</i>Save Note</a>")
  
    $($noteArea).appendTo($(this).parent());
    
  });
  
  $(document).on("click", "#savenote", function () {
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "POST",
      url: '/api/articles/' + thisId,
      data: {
        body: $("#noteInput").val(),
      }
    })
      .then(function (data) {
        $("#noteArea").remove(); 
        loadNote(thisId);
      });
  });
  
  $(document).on("click", "#seeNote", function () {
    var thisId = $(this).attr("data-id");
    loadNote(thisId);
  });
  
  $(document).on("click", "#deleteNote", function () {
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "DELETE",
      url: '/api/articles/' + thisId
    })
      .then(function (data) {
        $('#note').remove();
      });
  })
  
  function loadNote(id) {
    $.ajax({
      method: "GET",
      url: '/api/articles/' + id
    })
      .then(function (data) {
        $('#note').remove();
        const $note = $('<div>')
          .attr("class", "card-content")
          .attr("id", "note")
          .text("Note: " + data.note.body);
  
        $('.card-content[data-id=' + id + ']')
          .first()
          .append($note);
      });
  }