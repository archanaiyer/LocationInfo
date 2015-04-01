
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var nytapikey = "a66f32275ebf30846047a564aae15c9d:1:71761414";

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetvalue = $('#street').val();
    var cityvalue = $('#city').val();
    var address = streetvalue+', ' + cityvalue;
    var wikiurl = "http://en.wikipedia.org/w/api.php?action=opensearch&search="+cityvalue+"&format=json&callback=wikiCallback";
    var NYtimesURL = "https://api.nytimes.com/svc/search/v2/articlesearch.jsonp?q="+cityvalue+"&sort=newest&api-key='a66f32275ebf30846047a564aae15c9d:1:71761414'";

    var message = "So you want to move to "+address+"?";
    var streetviewurl ="https://maps.googleapis.com/maps/api/streetview?size=600x400&location="+address;
    $body.append('<img class="bgimg" src="'+streetviewurl+'">');
    $greeting.text(message);

        $.getJSON(NYtimesURL,function(data){
            nytHeaderElem.text("New York Times Articles about "+cityvalue);
            articles = data.response.docs;
            for(var i=0; i<articles.length; i++){
                var article = articles[i];
                nytElem.append('<li class="article">'+'<a href="'+article.web_url+'">'+article.headline.main+'</a>'+'<p>'+article.snippet+'</p>'+"</li>");
            };
        }).error(function(e){
            $nytHeaderElem.text("New York Times article could not be loaded");
        });

        var wikiRequestTimeout = setTimeout(function(){
            $wikiElem.text("Failed to get wikipedia resources")
        },5000);

        $.ajax({
            url: wikiurl,
            datatype: "jsonp",
            jsonp: "callback",
            success: function(response){
                var articlelist = response[1];

                for(var i=0; i<articlelist.length; i++){
                    articlestr = articlelist[i];
                    var url ="http://en.wikipedia.org/wiki/"+articlestr;
                    $wikiElem.append('<li><a href="'+url+'">'+articlestr + "</a></li>");
                };
            clearTimeout(wikiRequestTimeout);
            }
        })

    return false;
};

$('#form-container').submit(loadData);
