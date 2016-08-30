/**
 * Created by AGromov on 22.08.2016.
 */

var assert = require("assert"),
    TableRows = require("../../metrics/TableRows"),
    UniqueRows = require("../../metrics/UniqueRows"),
    HasDuplicates = require("../../metrics/HasDuplicates"),
    pg = require("pg"),
    chai = require("chai");
chai.use(require('chai-as-promised'));
chai.should();

describe("HasDuplicates", () => {
    describe("#calculate", () => {
        it("Should require list of prev metrics", (done) => {
            var hd = new HasDuplicates("a", "b", "c");
            hd.calculate().should.eventually.be.rejectedWith("Prevs not supplied").notify(done);
        });

        it("Should require both TableRows and UniqueRows list of prev metrics", (done) => {
            var hd = new HasDuplicates("a", "b", "c");
            hd.calculate([]).should.eventually.be.rejectedWith("Prerequisities not fulfilled").notify(done);
        });

        it("Should fail on absence of TableRows", (done) => {
            var hd = new HasDuplicates("a", "b", "c");

            hd.calculate([new UniqueRows()]).should.eventually.be.rejectedWith("Prerequisities not fulfilled").notify(done);
        });

        it("Should fail on absence of UniqueRows", (done) => {
            var hd = new HasDuplicates("a", "b", "c");
            hd.calculate([new TableRows()]).should.eventually.be.rejectedWith("Prerequisities not fulfilled").notify(done);
        });

        it("Should return false if counts of UniqueRows and TableRows are equal", (done) => {
            var hd = new HasDuplicates("a", "b", "c"),
                tr = new TableRows("a", "b", "c"),
                ur = new UniqueRows("a", "b", "c");

            tr.value = 10;
            ur.value = 10;

            hd.calculate([tr, ur]).should.eventually.equal(false).notify(done);
        });

        it("Should return true if counts of UniqueRows and TableRows are not equal", (done) => {
            var hd = new HasDuplicates("a", "b", "c"),
                tr = new TableRows("a", "b", "c"),
                ur = new UniqueRows("a", "b", "c");

            tr.value = 11;
            ur.value = 10;

            hd.calculate([tr, ur]).should.eventually.equal(true).notify(done);
        });
    });
});
