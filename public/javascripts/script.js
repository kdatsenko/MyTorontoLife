function getDocHeight() {
    var D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    );
}
var i = 6;
function addNextBox(){
    newBox = document.createElement("div");
    newBox.innerHTML = "<h1>Loading " + i +"</h1>"
    newBox.className = "box loading";
    document.getElementById("mainfeed").appendChild(newBox);
    i++;
}
var prev_scroll = 0;
function handleScroll(){
    // if(window.scrollY > window.innerHeight)
    // {
    //     // In the feed
    //     // document.getElementById("topNav").className = "feed";
    //     // document.getElementById("rightsidebar").style.top = (window.scrollY - window.innerHeight + 40) + "px";
    //     // document.getElementById("leftsidebar").style.top = (window.scrollY - window.innerHeight + 40) + "px";
    //
    // }
    // else
    // {
    //     // In the Hero image
    //     document.getElementById("topNav").className = "hero";
    // document.getElementById("rightsidebar").style.top = "40px";
    //     document.getElementById("leftsidebar").style.top = "40px";
    // }
    if (window.scrollY > getDocHeight() - 1000){
        // Download another box
        addNextBox();
    }
    prev_scroll = window.scrollY;
}
function handleResize(){
    if(window.innerHeight < document.getElementById("rightsidebar").clientHeight){
        console.log("hi");
    }
}

(function(){
    document.onscroll = handleScroll;
    document.onresize = handleResize;
    handleResize();
    handleScroll();
})();
