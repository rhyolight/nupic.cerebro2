var Utils = {};

/* From https://gist.github.com/ekeneijeoma/1186920 */
Utils.createLabel = function(text, size, color, backgroundColor, backgroundMargin) {
    if(!backgroundMargin)
        backgroundMargin = 50;

    var canvas = document.createElement("canvas");

    var context = canvas.getContext("2d");
    context.font = size + "pt Arial";

    var textWidth = context.measureText(text).width;

    canvas.width = textWidth + backgroundMargin;
    canvas.height = size + backgroundMargin;
    context = canvas.getContext("2d");
    context.font = size + "pt Arial";

    if(backgroundColor) {
        context.fillStyle = backgroundColor;
        context.fillRect(canvas.width / 2 - textWidth / 2 - backgroundMargin / 2, canvas.height / 2 - size / 2 - +backgroundMargin / 2, textWidth + backgroundMargin, size + backgroundMargin);
    }

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = color;
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var material = new THREE.MeshBasicMaterial({
        map : texture
    });

    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width, canvas.height), material);
    mesh.doubleSided = true;

    return mesh;
}

THREE.Utils = Utils;
