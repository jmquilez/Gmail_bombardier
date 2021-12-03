module.exports = {
    ifeq: function(a, b, options){
      if (a === b) {
        return options.fn(this);
        }
      return options.inverse(this);
    },
    bar: function(){
      return "BAR!";
    },
    ifEquals: function(arg1, arg2, options) {
        var fnTrue = options.fn, 
        fnFalse = options.inverse;
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    },
    calculation: function(value) {
        return value * 5;
    },

    list: function(value, options) {
        let out = "<ul>";
        for (let i = 0; i < value.length; i++) {
            out = out + "<li>" +  options.fn(value[i]) + "</li>";
        }
        return out + "</ul>";
    }
}