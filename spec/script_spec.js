const {  
  createVisitorsTable,
  addNewVisitor,
  listAllVisitors,
  deleteVisitor,
  updateVisitor,
  viewOneVisitor,
  deleteAllVisitors,
  viewLastVisitor} = require("../src/script.js");
const { pool } = require("../src/config.js");
const  mockedVisitor = [{ id: 1, name: 'John Doe', age: 30, date: '2024-06-08', time: '12:00', assistant: 'Assistant', comments: 'No comments' }];
const { queries } = require("../src/query_script.js");
const { errorMessages, status } = require("../src/script_objects.js");

describe("Database Tests", () => {
  let newVisitor;
  beforeEach(() => {
    spyOn(pool, "query");
    newVisitor = {
      name: "Bend Over",
      age: 25,
      date: "2024-05-13",
      time: "09:00",
      assistant: "Jane Smith",
      comments: "Interested in programming and designing courses",
    };
    args = [
      newVisitor.name,
      newVisitor.age,
      newVisitor.date,
      newVisitor.time,
      newVisitor.assistant,
      newVisitor.comments,
    ];
  });


  
  
  describe("createTable", () => {
    it("should create visitors table", async () => {
      await createVisitorsTable();
      expect(pool.query).toHaveBeenCalledOnceWith(queries.createVisitorsTable);
    });

    it("should return a success when the table is created", async () => {
      pool.query.and.returnValue({ rows: [] });
      const result = await createVisitorsTable();
      expect(result).toBe(status.tableCreated);
    });
  });

  describe("listAllVisitors", () => {
    it("should list all visitors", async () => {
      const mockVisitors = [newVisitor];
      pool.query.and.returnValue({ rows: mockVisitors });
      const result = await listAllVisitors();
      expect(result).toEqual(mockVisitors);
      expect(pool.query).toHaveBeenCalledWith(queries.listAllVisitors);
    });
  });

  describe("addNewVisitor", () => {
    it("should throw an error when name is  not a string", async () => {
      newVisitor.name = 123;
      await addNewVisitor(newVisitor).catch((error) =>
        expect(error.message).toBe(
          errorMessages.inputErrorMessages.string(newVisitor.name)
        )
      );
    });

    // it("should throw an error when name is not a valid name", async () => {
    //   newVisitor.name = "EA12";
    //   await addNewVisitor(newVisitor).catch((error) =>
    //     expect(error).toBe(
    //       errorMessages
    //     )
    //   );
    // });

    it("should throw an error when age is not a valid age", async () => {
      newVisitor.age = -1;
      await addNewVisitor(newVisitor).catch((error) =>
        expect(error.message).toBe(errorMessages.formatErrorMessages.ageFormatError)
      );
    });

    it("should throw an error when date is not a string", async () => {
      newVisitor.date = 2022 - 13 - 24;
      await addNewVisitor(newVisitor).catch((error) =>
        expect(error.message).toBe(
          errorMessages.inputErrorMessages.string(newVisitor.date)
        )
      );
    });

    it("should throw an error when date is not in the correct date format", async () => {
      newVisitor.date = "04-12-2022";
      await addNewVisitor(newVisitor).catch((error) =>
        expect(error.message).toBe(
          errorMessages.formatErrorMessages.dateOfVisitFormatError
        )
      );
    });

    it("should throw an error when time is not a string", async () => {
      newVisitor.time = 7;
      await addNewVisitor(newVisitor).catch((error) =>
        expect(error.message).toBe(
          errorMessages.inputErrorMessages.string(newVisitor.time)
        )
      );
    });

    it("should throw an error when time is not in the correct time format", async () => {
      newVisitor.time = "10:1";
      await addNewVisitor(newVisitor).catch((error) =>
        expect(error.message).toBe(
          errorMessages.formatErrorMessages.timeOfVisitFormatError
        )
      );
    });

    it("should throw an error when assistant is not a string", async () => {
      newVisitor.assistant = 123;
      await addNewVisitor(newVisitor).catch((error) =>
        expect(error.message).toBe(
          errorMessages.inputErrorMessages.string(newVisitor.assistant)
        )
      );
    });

    // it("should throw an error when assistant is not a valid name", async () => {
    //   newVisitor.assistant = "EA12";
    //   await addNewVisitor(newVisitor).catch((error) =>
    //     expect(error).toBe(
    //       errorMessages.formatErrorMessages.fullNameFormatError
    //     )
    //   );
    // });

    it("should throw an error when comments is not a string", async () => {
      newVisitor.comments = 123;
      await addNewVisitor(newVisitor).catch((error) =>
        expect(error.message).toBe(
          errorMessages.inputErrorMessages.string(newVisitor.comments)
        )
      );
    });

    it("should add a new visitor", async () => {
      await addNewVisitor(newVisitor);
      expect(pool.query).toHaveBeenCalledWith(queries.addNewVisitor, args);
    });

    it("should return a success when visitor is added", async () => {
      const result = await addNewVisitor(newVisitor);
      expect(result).toBe(status.visitorAdded);
    });
  });

  describe("deleteVisitor", () => {
    it("should delete a visitor and return success", async () => {
      pool.query.and.returnValue({ rowCount: 1 });
      const response = await deleteVisitor(1);

      expect(response).toBe(status.visitorDeleted);
      expect(pool.query).toHaveBeenCalledOnceWith(queries.deleteVisitor, [
        1,
      ]);
    });
     
    it("should return an error message if the visitor is not found", async () => {
      pool.query.and.returnValue({ rowCount: 0 });
      await deleteVisitor(1).catch((error) =>
        expect(error.message).toBe(status.visitorNotFound)
      );
      expect(pool.query).toHaveBeenCalledOnceWith(queries.deleteVisitor, [
        1,
      ]);
    });
  });

  describe("viewVisitor", () => {
    it("should view a visitor", async () => {
      newVisitor.date = new Date("2021-12-31");
      pool.query.and.returnValue({ rows: [newVisitor]});
      await viewOneVisitor(1);
      expect(pool.query).toHaveBeenCalledWith(queries.viewOneVisitor, [1]);
    });

    it("should return a visitor", async () => {
      newVisitor.date = new Date("2021-12-31");
      pool.query.and.returnValue({ rows: [newVisitor] });
      const result = await viewOneVisitor(1);
      expect(result).toEqual(newVisitor);
    });
  });

  describe("viewLastVisitor", () => {
    it("should view the last visitor", async () => {
      pool.query.and.returnValue({ rows: [mockedVisitor] });
      await viewLastVisitor();
      expect(pool.query).toHaveBeenCalledWith(queries.viewLastVisitor);
    });

    it("should return the last visitor", async () => {
      pool.query.and.returnValue({ rows: [mockedVisitor] });
      const result = await viewLastVisitor();
      expect(result).toEqual(mockedVisitor);
    });
    it("should update a visitor and return success", async () => {
      pool.query.and.returnValue({ rowCount: 1 });
      const column = "name";
      const result = await updateVisitor(1, column, "Teddy Bear");
      expect(pool.query).toHaveBeenCalledWith(
        queries.updateVisitor.replace("$1", column),
        ["Teddy Bear", 1]
      );
      expect(result).toBe(status.visitorUpdated);
    });
  });

  describe("deleteAllVisitors", () => {
    it("should delete all visitors", async () => {
      pool.query.and.returnValue({ rowCount: 1 });
      await deleteAllVisitors();
      expect(pool.query).toHaveBeenCalledWith(queries.deleteAllVisitors);
    });

    it("should return a success message when all visitors are deleted", async () => {
      pool.query.and.returnValue({ rowCount: 1 });
      const result = await deleteAllVisitors();
      expect(result).toBe(status.allVisitorsDeleted);
    });

    it("should return no visitors found when no visitors are found", async () => {
      pool.query.and.returnValue(Promise.resolve({ rowCount: 0 }));
      const result = await deleteAllVisitors();
      expect(result).toBe(status.noVisitorsFound);
    });

     
  });
});