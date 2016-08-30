/**
 * Created by AGromov on 22.08.2016.
 */

var assert = require("assert"),
    TableRows = require("../../metrics/TableRows"),
    pg = require("pg"),
    chai = require("chai");
chai.use(require('chai-as-promised'));
chai.should();

var queryStub = {
    evts: {},
    on: function(evt, cb) {
        this.evts[evt] = cb;
    },

    fakeEvent: function(evt, retVal) {
        this.evts[evt](retVal);
    }
};
var connectionStub = {
    query: function(query) {
        queryStub.text = query;
        queryStub.evts = {};
        return queryStub;
    }
};


describe("TableRows", () => {
    describe("#constructor", () => {
        it("Should work normally and properly set all the fields", () => {
            var tr = new TableRows("a", "b", "c");
            assert(tr.title, "Rows");
        });
    });

    describe("#calculate", () => {
        it("Should return number of rows in table as promise result", (done) => {
            var tr = new TableRows(connectionStub, "tbl", "fld");
            tr.calculate().should.eventually.equal(3).notify(done);
            queryStub.fakeEvent("row", {cnt: 3});
            queryStub.fakeEvent("end", {});
        });

        it("Should fail promise on error", (done) => {
            var tr = new TableRows(connectionStub, "tbl", "fld");
            tr.calculate().should.eventually.be.rejectedWith("Fake error").notify(done);
            queryStub.fakeEvent("error", "Fake error");
        });
    });
});
