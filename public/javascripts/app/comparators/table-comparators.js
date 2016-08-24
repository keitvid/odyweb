/**
 * Created by AGromov on 24.08.2016.
 */

define([
    "app/comparators/table/is_null_table",
    "app/comparators/table/field_list"
], function(
    is_null_table,
    field_list,
) {
    return [is_null_table, field_list];
});