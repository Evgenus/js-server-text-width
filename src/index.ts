interface Options {
  fontName?: string;
  fontSize?: string;
  fontWeight?: string;
}

interface Dictionary<T> {
  [Key: string]: T;
}

const base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

const base64codes: Dictionary<number> = {}
for(var index = 0; index < base64chars.length; index++) {
    base64codes[base64chars[index]] = index;
}

function base64ToFloat(str: string): number {
  var integer = base64codes[str[0]];
  var fract64 = base64codes[str[1]];
  var fractional = fract64 / 64;
  return integer + fractional;
}

export function init(charactersTable: Dictionary<string>) {
  const lookupTable = (char: string, options?: Options) => {
    var code = char.charCodeAt(0);
    for (var row in charactersTable) {
      var [font, size, weight, start16] = row.split('|');
      if (options?.fontName && options.fontName !== font) {
        continue;
      }
      if (options?.fontSize && options.fontSize !== size) {
        continue;
      }
      if (options?.fontWeight && options.fontWeight !== weight) {
        continue;
      }
      var data = charactersTable[row];
      var start = parseInt(start16, 16);
      var end = start + data.length / 2;
      if (start <= code && code <= end) {
        var pos = (code - start) * 2;
        return base64ToFloat(data.slice(pos, pos + 2));
      }
    }
  };

  const getTextWidth = (text: string, options?: Options) => {
    return Array.from(text).reduce(
      (sum, item) => sum + (lookupTable(item, options) || 0),
      0,
    );
  };

  return { getTextWidth };
}


