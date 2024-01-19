window.addEventListener("load",function(){
    const form = document.getElementById("form");

    const emailInput = document.getElementById("email-input");
    const contentInput = document.getElementById("content-input");

    const contentError = document.getElementById("content-error");

    var submitted = false;
    var processing = false;

    form.onsubmit = function(){
        if(submitted) return false;
        if(processing) return false;
        const content = contentInput.value;

        if(content.replace(" ","") === ""){
            contentError.innerText = "Message can't be empty";
            return false;
        }
        if(content.length > 2000){
            contentError.innerText = "Too long. Maximum length is 2000 characters.";
            return false;
        }

        var email = emailInput.value;
        if(email.replace(" ","") === "") email = "No email specified";

        processing = true;

        const url = "https://discord.com/api/webhooks/1197557152047444111/o0jJdbX2BFgE2v6-mjy51HfLTEwPW2g6qIZXsYvERAmKXQDbwdUPDDulftGFg6f2ieoU";
        httpPost(url,{
            username: email,
            content: content
        },function(code){
            processing = false;
            if(code === 204){
                alert("Form submitted successfully! \nIf you specified an email, you should get a reply in up to 24 hours.\nReturning to the home page.");
                window.location.href = "index.html";
                submitted = true;
            }
            else {
                alert("Something went wrong. Error: "+code);
            }
        });

        return false;
    }

    contentInput.addEventListener("focusin",function(){
        forcePosition = false;
    });
    contentInput.addEventListener("focusout",function(){
        forcePosition = true;
    });
})