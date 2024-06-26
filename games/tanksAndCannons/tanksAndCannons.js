depend("canvasGame");

window.addEventListener("load",function(){
    const canvas = document.getElementById("canv");
    const ctx = canvas.getContext("2d");

    const imgTank1Base = document.getElementById("img-tank1-base");
    const imgTank1Cannon = document.getElementById("img-tank1-cannon");

    var tanks = [];
    var cannons = [];

    const columns = 9;
    const rows = 5;
    const cellSize = 25;
    const cellSpacing = 1.2;

    const rotSpeed = 2;

    for(var i=0;i<columns*rows;i++){
        cannons.push(null);
    }

    function addTank(){
        const base = new CanvasSprite(imgTank1Base);
        const cannon = new CanvasSprite(imgTank1Cannon);

        const scale = 0.6;

        base.rescale(scale);
        cannon.rescale(scale);

        tanks.push({
            base: base,
            cannon: cannon
        })
    }

    function addCannon(cellIdx){
        cannons[cellIdx] = new CanvasSprite(imgTank1Cannon);
    }

    addCannon(0);
    addCannon(1);
    addCannon(2);

    addTank()

    setInterval(function(){
        // TODO: use delta time
        clearCanvas(canvas);

        for(var i=0;i<tanks.length;i++){
            const tank = tanks[i];
            tank.base.render(canvas);
            tank.cannon.render(canvas);
        }

        for(var i=0;i<cannons.length;i++){
            const colIdx = i % columns;
            const rowIdx = Math.floor(i / columns);

            var x = (colIdx * cellSize*cellSpacing) + 18;
            var y = (rowIdx * cellSize*cellSpacing) + 150;

            ctx.fillRect(x,y,cellSize,cellSize);

            const cannon = cannons[i];
            if(cannon){
                if(isBtnPressed("left")) cannon.rotation -= rotSpeed;
                if(isBtnPressed("right")) cannon.rotation += rotSpeed;

                cannon.area.moveTo(new Vector2(x-cellSize/4,y-cellSize/1.5));
                cannon.render(canvas);
            }
        }

    });
})