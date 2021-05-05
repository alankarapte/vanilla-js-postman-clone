// custom paramter counts;
let customParameterCount = 1;

// getting radio input of content type
let radioJsonString = document.getElementById("jsonRadio");
let radioCustomParameter = document.getElementById("custParaRadio");

// getting div element of content types
let jsonStringBox = document.querySelector("#my-json-box");
let customParameterBox = document.querySelector("#my-custom-paramter-box");

// hide custom parameter box inititially
customParameterBox.style.display = "none";

//toggle custom parameter box & json string box as per radio button selection
radioCustomParameter.addEventListener("click", () => {
    jsonStringBox.style.display = "none";
    customParameterBox.style.display = "block";
});
radioJsonString.addEventListener("click", () => {
    customParameterBox.style.display = "none";
    jsonStringBox.style.display = "flex";
});

//add new paramter input on 'add new parameter button'
document.getElementById("addNewParameter").addEventListener("click", () => {
    customParameterCount++;
    let customParameterTemplate = `
             <div class=" form-group row" id="my-paramtercontrols-section${customParameterCount}">
                 <label class="col-sm-2 col-form-label ">Parameter</label>
                 <div class=" ml-0 col-sm-10" >
                     <div class="row my-custom-parameter-keyvalue">
                         <input class="form-control mx-2 col-4" type="text" name="" id="parameterkey${customParameterCount}"
                             placeholder="Enter Key">
                         <input class="form-control mx-2 col-4" type="text" name="" id="parametervalue${customParameterCount}"
                             placeholder="Enter Value">
                         <button type="button" onclick="removeCustPara(event)"
                             class="btn btn-primary mx-2 font-weight-bold" 
                             id="removeparameter${customParameterCount}">-
                         </button>
                     </div>
                 </div>
             </div>
         `;

    customParameterBox.appendChild(getDOMElementfromString(customParameterTemplate));
});



//our custom utility functions:

// to create dom element from string
function getDOMElementfromString(elementTemplate) {
    let element = document.createElement("div");
    element.innerHTML = elementTemplate;
    return element.firstElementChild;
}
// to remove custom parameter element
function removeCustPara(e) {
    e.target.parentElement.parentElement.parentElement.remove();
    // let parentNode = e.target.parentElement.parentElement.parentElement.parentElement;
    // parentNode.removeChild(e.target.parentElement.parentElement.parentElement);
    customParameterCount--;
}

//Fetch API; sent GET or POST request and show response data
document.getElementById("submitButton").addEventListener("click", (e) => {

    let url = document.querySelector("#urlText").value;
    let requestType = document.querySelector("input[name='requestTypeRadioGroup']:checked").value;
    let contentType = document.querySelector("input[name='contentTypeRadioGroup']:checked").value;
    let responseData = document.getElementById("responseTextarea");

    responseData.value = "Please wait...";
    let data = {};

    if (contentType == 'customParameter') {
        let elements = document.querySelectorAll(".my-custom-parameter-keyvalue");

        for (const element of Array.from(elements)) {
            data[element.children[0].value] = element.children[1].value
        }
        data = JSON.stringify(data);
    } else {
        data = document.querySelector("#jsonTextarea").value;
    }

    //using async with fetch api
    if (requestType == "GET") {
        getRequestAsync(url).then((data) => {
            console.log(data.data);
            responseData.value = JSON.stringify(data.data);
        });
    } else {

        postRequestAsync(url, data).then((data) => {
            console.log("data is", data);
            responseData.value = JSON.stringify(data.data);
        });
    }
});

async function getRequestAsync(url) {
    let result = await fetch(url);
    return await result.json();
}

async function postRequestAsync(url, data) {

    let result = await fetch(url, {
        method: "post",
        body: data
    });

    let jsonData = await result.json();
    return jsonData
}
