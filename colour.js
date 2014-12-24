function Colour(colour){
    var self = {};
    self.colour = colour.toUpperCase();

    self.isValidColour = function(){
        var pattern = new RegExp("^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$");
        return pattern.test(self.colour);
    };

    self.getFullColour = function(){
        if (self.fullColour != undefined){
            return self.fullColour;
        }
        if (self.isValidColour()){
            if (self.colour.length == 4) {
                self.fullColour = self.colour + self.colour.substr(1);
                return self.fullColour;
            }
            return self.colour;
        }
        throw new Error("Invalid colour = " + self.colour);
    }

    self.getName = function(){
        var fullColour = self.getFullColour();
        var exactMatch = default_map[fullColour];
        if (exactMatch !== undefined){
            return exactMatch.toLowerCase();
        }
        return self.getApproximateName();
    }

    self.getApproximateName = function(){
        var fullColour = self.getFullColour();
        var rgb = self.getRGB();
        var r = rgb[0], g = rgb[1], b = rgb[2];
        var hsl = self.getHSL();
        var h = hsl[0], s = hsl[1], l = hsl[2];

        var closet_colour = undefined;
        var diff = -1;

        for (var key in default_map){
            var curr_colour = new Colour(key);
            var c_rgb = curr_colour.getRGB();
            var c_hsl = curr_colour.getHSL();
            var sq_rgb = Math.pow(r - c_rgb[0], 2) + Math.pow(g - c_rgb[1], 2) + Math.pow(b - c_rgb[2], 2);
            var sq_hsl = Math.pow(r - c_hsl[0], 2) + Math.pow(g - c_hsl[1], 2) + Math.pow(b - c_hsl[2], 2);
            var sq = sq_rgb + sq_hsl * 2;
            if (diff < 0 || diff > sq) {
                diff = sq;
                closet_colour = key;
            }
        }

        return default_map[closet_colour].toLowerCase() + "_approx";
    }

    self.getRGB = function() {
        var fullColour = self.getFullColour();
        var red = parseInt('0x' + fullColour.substring(1, 3));
        var green = parseInt('0x' + fullColour.substring(3, 5));
        var blue = parseInt('0x' + fullColour.substring(5, 7));
        return [red, green, blue];
    }

    self.getHSL = function() {
        var rgb = self.getRGB();
        var r = rgb[0]/255, g = rgb[1]/255, b = rgb[2]/255;

        var min = Math.min(r, Math.min(g, b));
        var max = Math.max(r, Math.max(g, b));
        var delta = max - min;

        var l = (min + max) / 2;

        var s = 0;
        if (l > 0 && l < 1) {
            s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));
        }

        var h = 0;
        if (delta > 0) {
            if (max == r && max != g) h += (g - b) / delta;
            if (max == g && max != b) h += (2 + (b - r) / delta);
            if (max == b && max != r) h += (4 + (r - g) / delta);
            h /= 6;
        }

        return [parseInt(h * 255), parseInt(s * 255), parseInt(l * 255)];
    }

    self.getYUV = function(){
        var rgb = self.getRGB();
        var r = rgb[0]/255, g = rgb[1]/255, b = rgb[2]/255;

        var y = 0.299 * r + 0.587 * g + 0.114 * b;
        var u = -0.147 * r + -0.289 * g + 0.463 * b;
        var v = 0.615 * r + -0.515 * g + -0.100 * b;

        return [y, u, v];
    }

    return self;
}

var default_map = {
    "#FFC0CB": "p_Pink",
    "#FFB6C1": "p_LightPink",
    "#FF69B4": "p_HotPink",
    "#FF1493": "p_DeepPink",
    "#DB7093": "p_PaleVioletRed",
    "#C71585": "p_MediumVioletRed",
    "#FFA07A": "r_LightSalmon",
    "#FA8072": "r_Salmon",
    "#E9967A": "r_DarkSalmon",
    "#F08080": "r_LightCoral",
    "#CD5C5C": "r_IndianRed",
    "#DC143C": "r_Crimson",
    "#B22222": "r_FireBrick",
    "#8B0000": "r_DarkRed",
    "#FF0000": "r_Red",
    "#FF4500": "o_OrangeRed",
    "#FF6347": "o_Tomato",
    "#FF7F50": "o_Coral",
    "#FF8C00": "o_DarkOrange",
    "#FFA500": "o_Orange",
    "#FFFF00": "y_Yellow",
    "#FFFFE0": "y_LightYellow",
    "#FFFACD": "y_LemonChiffon",
    "#FAFAD2": "y_LightGoldenrodYellow",
    "#FFEFD5": "y_PapayaWhip",
    "#FFE4B5": "y_Moccasin",
    "#FFDAB9": "y_PeachPuff",
    "#EEE8AA": "y_PaleGoldenrod",
    "#F0E68C": "y_Khaki",
    "#BDB76B": "y_DarkKhaki",
    "#FFD700": "y_Gold",
    "#FFF8DC": "b_Cornsilk",
    "#FFEBCD": "b_BlanchedAlmond",
    "#FFE4C4": "b_Bisque",
    "#FFDEAD": "b_NavajoWhite",
    "#F5DEB3": "b_Wheat",
    "#DEB887": "b_BurlyWood",
    "#D2B48C": "b_Tan",
    "#BC8F8F": "b_RosyBrown",
    "#F4A460": "b_SandyBrown",
    "#DAA520": "b_Goldenrod",
    "#B8860B": "b_DarkGoldenrod",
    "#CD853F": "b_Peru",
    "#D2691E": "b_Chocolate",
    "#8B4513": "b_SaddleBrown",
    "#A0522D": "b_Sienna",
    "#A52A2A": "b_Brown",
    "#800000": "b_Maroon",
    "#556B2F": "g_DarkOliveGreen",
    "#808000": "g_Olive",
    "#6B8E23": "g_OliveDrab",
    "#9ACD32": "g_YellowGreen",
    "#32CD32": "g_LimeGreen",
    "#00FF00": "g_Lime",
    "#7CFC00": "g_LawnGreen",
    "#7FFF00": "g_Chartreuse",
    "#ADFF2F": "g_GreenYellow",
    "#00FF7F": "g_SpringGreen",
    "#00FA9A": "g_MediumSpringGreen",
    "#90EE90": "g_LightGreen",
    "#98FB98": "g_PaleGreen",
    "#8FBC8F": "g_DarkSeaGreen",
    "#3CB371": "g_MediumSeaGreen",
    "#2E8B57": "g_SeaGreen",
    "#228B22": "g_ForestGreen",
    "#008000": "g_Green",
    "#006400": "g_DarkGreen",
    "#66CDAA": "c_MediumAquamarine",
    "#00FFFF": "c_Aqua",
    "#00FFFF": "c_Cyan",
    "#E0FFFF": "c_LightCyan",
    "#AFEEEE": "c_PaleTurquoise",
    "#7FFFD4": "c_Aquamarine",
    "#40E0D0": "c_Turquoise",
    "#48D1CC": "c_MediumTurquoise",
    "#00CED1": "c_DarkTurquoise",
    "#20B2AA": "c_LightSeaGreen",
    "#5F9EA0": "c_CadetBlue",
    "#008B8B": "c_DarkCyan",
    "#008080": "c_Teal",
    "#B0C4DE": "bl_LightSteelBlue",
    "#B0E0E6": "bl_PowderBlue",
    "#ADD8E6": "bl_LightBlue",
    "#87CEEB": "bl_SkyBlue",
    "#87CEFA": "bl_LightSkyBlue",
    "#00BFFF": "bl_DeepSkyBlue",
    "#1E90FF": "bl_DodgerBlue",
    "#6495ED": "bl_CornflowerBlue",
    "#4682B4": "bl_SteelBlue",
    "#041690": "bl_RoyalBlue",
    "#0000FF": "bl_Blue",
    "#0000CD": "bl_MediumBlue",
    "#00008B": "bl_DarkBlue",
    "#000080": "bl_Navy",
    "#191970": "bl_MidnightBlue",
    "#E6E6FA": "pu_Lavender",
    "#D8BFD8": "pu_Thistle",
    "#DDA0DD": "pu_Plum",
    "#EE82EE": "pu_Violet",
    "#DA70D6": "pu_Orchid",
    "#FF00FF": "pu_Fuchsia",
    "#FF00FF": "pu_Magenta",
    "#BA55D3": "pu_MediumOrchid",
    "#9370DB": "pu_MediumPurple",
    "#8A2BE2": "pu_BlueViolet",
    "#9400D3": "pu_DarkViolet",
    "#9932CC": "pu_DarkOrchid",
    "#8B008B": "pu_DarkMagenta",
    "#800080": "pu_Purple",
    "#4B0082": "pu_Indigo",
    "#483D8B": "pu_DarkSlateBlue",
    "#663399": "pu_RebeccaPurple",
    "#6A5ACD": "pu_SlateBlue",
    "#7B68EE": "pu_MediumSlateBlue",
    "#FFFFFF": "w_White",
    "#FFFAFA": "w_Snow",
    "#F0FFF0": "w_Honeydew",
    "#F5FFFA": "w_MintCream",
    "#F0FFFF": "w_Azure",
    "#F0F8FF": "w_AliceBlue",
    "#F8F8FF": "w_GhostWhite",
    "#F5F5F5": "w_WhiteSmoke",
    "#FFF5EE": "w_Seashell",
    "#F5F5DC": "w_Beige",
    "#FDF5E6": "w_OldLace",
    "#FFFAF0": "w_FloralWhite",
    "#FFFFF0": "w_Ivory",
    "#FAEBD7": "w_AntiqueWhite",
    "#FAF0E6": "w_Linen",
    "#FFF0F5": "w_LavenderBlush",
    "#FFE4E1": "w_MistyRose",
    "#DCDCDC": "g_Gainsboro",
    "#D3D3D3": "g_LightGrey",
    "#C0C0C0": "g_Silver",
    "#A9A9A9": "g_DarkGray",
    "#808080": "g_Gray",
    "#696969": "g_DimGray",
    "#778899": "g_LightSlateGray",
    "#708090": "g_SlateGray",
    "#2F4F4F": "g_DarkSlateGray",
    "#000000": "g_Black"
}
