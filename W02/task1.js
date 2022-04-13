class Vec3
{
     constructor(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

Vec3.prototype.min = function()
{
    const m = this.x < this.y ? this.x : this.y;
    return m < this.z ? m : this.z;
}

Vec3.prototype.max = function()
{
    const m = this.x > this.y ? this.x: this.y;
    return m > this.z ? m : this.z; 
}

Vec3.prototype.sum = function()
{
    return this.x + this.y + this.z;
}

Vec3.prototype.mid = function()
{
    return this.sum() - this.min() - this.max();
}
