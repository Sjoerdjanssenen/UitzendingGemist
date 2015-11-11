var Template = function() {
  function getChannels(){
    output = ``

    for(i=1; i < 4; i++){      
      output += `<lockup view="liveVideo" channel="ned`+i+`">
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
