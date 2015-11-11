var Template = function() {
  function getChannels(){
    output = ``

    for(i=1; i < 4; i++){
	  var hash;
	  
	  if (i == 1) {
		  var hash = "0b420097e31497d523e2f40bd10894a4";
	  } else if (i == 2) {
		  var hash = "bb6b8398265ced64715f30b9ac1a4f63";
	  } else if (i == 3) {
		  var hash = "5a21d96b8c83ad4d5b33ee15432930ac";
	  }   
	    
      output += `<lockup view="liveVideo" channel="`+i+`" hash="`+hash+`">
                   <img src="`+resourceLoader.BASEURL +`img/npo`+i+`.png" width="460" height="230"/>
                   <title>NPO `+i+`</title>
                 </lockup>`
    }

    return output;
  }

  return `<?xml version="1.0" encoding="UTF-8" ?>
  <document>
    <stackTemplate>
      <collectionList>
        <grid>
          <header>
            <title>Live</title>
          </header>
          <section>` + getChannels() + `</section>
        </grid>
      </collectionList>
    </stackTemplate>
  </document>`
}
