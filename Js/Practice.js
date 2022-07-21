function createObject(name)
{
    var o = new Object();
    o.name = name;

    o.sayName = function()
    {
        alert(this.name);
    }
    return o;
}

function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function () {
        alert(this.name);
    };
}

function testProtoType(name, age)
{
    this.name = name;
    this.age = age;

    this.pro = function () {
        alert("Pro");
    };
}

aaa = Class({
    de: 1,
    test1: function(){
        alert("Good!");
    }
});

NewPerson = function()
{

}

NewPerson.prototype.name = "test111";
NewPerson.prototype.age = 22;


O = {
    toString:function()
    {
        return "my Object";
    }
}



