/**
 * Created by AGromov on 22.08.2016.
 */
'use strict';
var assert = require("assert");
var MetricsBase = require("../../metrics/MetricsBase");

describe("MetricsBase", () => {
    describe("#constructor", () => {
        it(`
        Should allow to make derived class instances with calculate method and fill fields
         - connection
         - table
         - field
        `, () => {
            class Tst extends MetricsBase {
                constructor(a, b, c) {
                    super(a, b, c);
                    this.title = "Tst";
                }

                calculate() {

                }
            }

            var a = new Tst("a", "b", "c");
            assert.equal(a.connection, "a");
            assert.equal(a.table, "b");
            assert.equal(a.field, "c");

        });

        it("Shouldn't allow to make instance", () => {
            assert.throws(() => {
                var a = new MetricsBase("a", "b", "c");
            });
        });

        it("Shouldn't allow to make derived instance without calculate method in it", () => {
            class TstNoCalc extends MetricsBase {
                constructor(a, b, c) {
                    super(a, b, c);
                    this.title = "tst no calc";
                }
            }

            assert.throws(() => {
                var a = new TstNoCalc("1", "2", "3");
            });
        })
    });
});
