/**
 * Created by AGromov on 23.08.2016.
 */
define([], function() {
    return {
        validationMessage: "Table structure differs",
        severity: "danger",
        compare: function(tables) {
            var basicTable = tables[0],
                result = true,
                fieldList = basicTable.columns.map((item) => {
                    return item.name;
                });
            
            tables.forEach((table) => {
                if(fieldList.length != table.columns.length) {
                    result = false;
                    return;
                }
                var keys = {};
                table.columns.forEach((c) => {
                    keys[c.name] = 1;
                });
                for(let col of fieldList) {
                    if(!keys[col]) {
                        result = false;
                        return;
                    }
                }
            });

            return result;
        }
    };
});