const file_text = $("#file_text");
let urlList = [];
file_text.addEventListener("change", ()=>{
    const fr = new FileReader();    
    fr.readAsText(file_text.files[0]);
    fr.addEventListener("load", ()=>{
       if(!isValidExten(file_text.files[0].name)){
           $("#invalid").style.color = "red"
           $("#invalid").textContent = "Invalid File"
       }else{
           const urlTextFile = (fr.result). split('\n');  
           messageContent('Please wait...')
           urlTextFile.forEach(urlText=>{               
               fetchUrl(urlText)
           })
       }
    })
})

$("#btn_import").addEventListener("click",()=>{
    file_text.click();
})

$("#form_url").addEventListener("submit",e=>{
    e.preventDefault();
    const url = $("#url_text").value;
    if(url.length!==0){
        $("#url_text").value = "";
        messageContent('Please wait...')
        fetchUrl(url);
    }
})
function $(element){
    return document.querySelector(element);
}

function youtube_parser(url){
      return new Promise((resolve)=>{
          var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
          var match = url.match(regExp);
          resolve((match&&match[7].length==11)? match[7] : false)     
      })  
}

function isValidExten(filename){
    const extension = (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
    return "txt" == extension;
}



function getImage(url){
    return new Promise((resolve)=>{
        resolve(`https://img.youtube.com/vi/${url}/hqdefault.jpg`);
    })   
}

async function fetchUrl(url){
    const url_id = await youtube_parser(url);
    const imageUrl = await getImage(url_id);    
    const obj = {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com',
            'x-rapidapi-key': '3ca26f1ec9msh45078f985bdafd6p1338aajsn896d4762287f'
        }
    } 
        await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${url_id}`, obj)
    .then(res=>{   
                                    
        return res.json();
    })
    .then(res=>{      
        res["img"] = imageUrl;
        urlList.push(res);        
        displayData(urlList.reverse());                       
    })
    .catch(error=>{         
         $("#data_info").innerHTML = '<center>Failed to Connect</center>'  
    })
}

function messageContent(message){
    const center = document.createElement("center")
  center.innerHTML = message;  
        $("#data_info").appendChild(center)
}
function displayData(urlListData){    
    let elementData = "";
    
    for(let i in urlListData){
        var urlRes = urlListData[i];
        if(urlRes.status==="ok"){
            elementData += `
            <div class="info" id="${i}">
                <div class="img-thumbnail">
                   <img src="${urlRes.img}" alt="thumbnail" class="thumbnail-img"> 
                </div>
                <div class="info_text">
                    <p class="info-title">${urlRes.title}</p>
                </div>
                <div class="btns-remove">
                    <a class="btn-download button-3" href="${urlRes.link}"><i class="fas fa-download"></i></a>
                    <div class="btn-remove button-3" onclick="removeData(${i})"><i class="fas fa-trash-alt"></i></div>
                </div>
            </div>
    `    
        }        
    }           
    $("#data_info").innerHTML = elementData;
}
function removeData(id){
    urlList.splice(id, 1);
    displayData(urlList);
}
