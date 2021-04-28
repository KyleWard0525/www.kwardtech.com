
function handleNavTestBtn()
{
    //  Get page and create new text node
    var mainPage = document.getElementById("main-bg-image");
    var msg = document.createTextNode("The nav button was pressed successfully!");

    //  Style page element
    mainPage.style.textAlign = "center";
    mainPage.style.fontWeight = "lighter";
    mainPage.style.fontStyle = "italic";
    mainPage.style.fontSize = "24px";
    mainPage.style.fontFamily = "Times New Roman,Times,serif";

    //  Add message to page
    mainPage.append(msg);

    //  Remove nav button
    document.getElementById("nav-btn-test").remove();
}
