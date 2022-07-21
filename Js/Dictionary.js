Dictionary = Class(
{
    data : null,

    initialize : function()
    {
       
    },

    put : function(key, value)
    {
        this.data[key] = value;
    },

    get : function(key)
    {
        return this.data[key];
    },

    remove : function (key)
    {
        this.data[key] = null;
    },

    size : function()
    {
        return this.data.length == 0;
    },

});