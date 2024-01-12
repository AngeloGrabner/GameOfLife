

class Game
{
    constructor(Width, Height, pWidth = 1280, pHeight = 720)
    {
        this.canvas = createCanvas(pWidth,pHeight);
        this.canvasWidth = pWidth;
        this.canvasHeight = pHeight;
        this.editMode = false;
        this.width = Width;
        this.height = Height;
        this.map = new Array(this.width*this.height);
        this.map.fill(false);

        for (let i = 0; i < this.map.length; i++)
            this.map[i] = Math.floor(Math.random()*10) == 0;
        this.currentTime = 0.0;
        this.delayTime = 1.0;

        this.sliderWidth = createSlider(16,160);
        this.sliderHeight = createSlider(9,90);
        this.checkBoxEdit = createCheckbox("Edit mode", false);
        this.sliderDelay = createSlider(0,10,1);
        this.selectDrawMode = createSelect(false);
        this.clearButton = createButton("clear");

        this.clearButton.mousePressed(() => {this.map.fill(false);});
        this.SetupSetting();
    }

    SetupSetting()
    {
        this.selectDrawMode.option("red & blue");
        this.selectDrawMode.option("matrix");
        this.selectDrawMode.option("traffic light");
        this.selectDrawMode.option("dawn");
    }

    Settings()
    {
        let resizeFlag = false;
        if (this.sliderWidth.value() != this.width)
        {
            this.width = this.sliderWidth.value();
            resizeFlag = true;
        }
        if (this.sliderHeight.value() != this.height)
        {
            this.height = this.sliderHeight.value();
            resizeFlag = true;
        }

        if (resizeFlag)
        {
            this.map = new Array(this.width*this.height);
            this.map.fill(false);
            for (let i = 0; i < this.map.length; i++)
            this.map[i] = Math.floor(Math.random()*10) == 0;
        }

        this.editMode = this.checkBoxEdit.checked();

        this.delayTime = this.sliderDelay.value()/10.0;
    }

    GetNextCellState(x,y)
    {
        let count = 0;
        for (let i = -1; i < 2; i++)
        {
            for (let j = -1; j < 2; j++)
            {
                if (j === 0 && i === 0)
                    continue;
                let X = (x + j);
                if (X < 0)
                {
                    X = this.width-1;
                }
                let Y = (y + i);
                if (Y < 0)
                {
                    Y = this.height-1;
                }
                if (this.map[(X%this.width) + this.width * (Y%this.height)] === true)
                {
                    count++;
                }
            }
        }
        if (this.map[x + this.width*y] === true)
        {
            if (count === 2 || count === 3)
                return true;
            else 
                return false;
        }
        else if (count === 3)
        {
            return true;
        }
    }

    Update()
    {
        this.Settings();
        if (!this.editMode)
        {
            
            this.currentTime += deltaTime/1000.0;
            if (this.currentTime >= this.delayTime)
            {
                this.currentTime = 0;
                let tempMap = new Array(this.width*this.height);
                for (let y = 0; y < this.height; y++)
                {
                    for (let x = 0; x < this.width; x++)
                    {
                        tempMap[x+this.width*y] = this.GetNextCellState(x,y);
                    }
                }
                this.map = tempMap;
            }
        }
        else
        {
            this.Edit();
        }
    }
    Edit()
    {

        if (mouseX < this.canvasWidth && mouseX >= 0 &&
            mouseY < this.canvasHeight && mouseY >= 0)
        {
            if (mouseIsPressed)
            {
                let stepY = height / this.height;
                let stepX = width / this.width;
                this.map[Math.floor(mouseX/stepX) + this.width * Math.floor(mouseY/stepY)] = true;
            }
        }
    }
    Shade(x,y)
    {
        let r = 0, g = 0, b = 0, a = 255;
        switch (this.selectDrawMode.value())
        {
            case "red & blue":
            r = 255 * (x/this.width);
            b = 255 * (y/this.height);
            a = 255 * (Math.max(y/this.height,x/this.width));
            break;

            case "matrix":
            g = 200 * (1-(y/this.height)) + 50;
            b = 50 * (x/this.width);
            break;

            case "traffic light":
            r = 255 * (Math.sin(x/2)+1)/2;
            g = 255 * (Math.cos(y/2)+1)/2;
            break;

            case "dawn":
            r = 220 * (1-(y/this.height));
            g = 120 * ((Math.cos(y/this.height*Math.PI*2)+1)/2);
            b = 255 * (y/this.height);
            break
            default:
                break;
        }
        return color(r,g,b,a);
    }
    
    Draw()
    {
        clear(255);
        noStroke();
        let stepY = height / this.height;
        let stepX = width / this.width;
        for (let y = 0; y < this.height; y++)
        {
            for (let x = 0; x < this.width; x++)
            {
                if (this.map[x+ this.width*y] === true)
                {
                    fill(this.Shade(x,y));
                    rect(x*stepX,y*stepY,stepX,stepY);
                }
            }
        }
    }



}

let game = undefined; 

function setup()
{
    game = new Game(240,160);
}
function draw()
{
    game.Update();
    game.Draw();
}

