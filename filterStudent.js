const Student = require('../../models/students/studentsModel')

module.exports.filterStudent = async function (req, res) {
    const allFilter = Object.entries(req.query)
    var finalFilter = []
    for (let f of allFilter) {
        if (f[1] === "") {

        } else {
            finalFilter.push(f)
        }
    }
    let classQuery;
    let toQuery;
    let branchQuery;

    /**
     * @forLoop there have little bit confusion
     */

    for (let i = 0; i < finalFilter.length; i++) {

        if (finalFilter[i][0] === "class") {
            classQuery = finalFilter[i][1];
        } else if (finalFilter[i][0] === "to") {
            toQuery = finalFilter[i][1]
        } else if (finalFilter[i][0] === "branch") {
            branchQuery = finalFilter[i][1]
        }
    }


    try {
        /**
        * @class Done 
        * @class & @to Done
        * @class & @Branch Done 
        * @class & @branch & @to done
        */

        if (classQuery && !toQuery && !branchQuery) {
            console.log("Just Class Query Called !", classQuery)
            const studentByClass = await Student.find({ class: classQuery })
            // console.log(studentByClass)
            if (studentByClass.length > 0) {
                res.status(200).json({ length: studentByClass.length, payload: studentByClass })
            } else {
                res.status(200).json({ message: "Student Not Found in This Class " })
            }
        } else if (branchQuery && classQuery && !toQuery) {
            console.log("Just Branch and Class Query Called", classQuery, branchQuery)
            const students = await Student.find({ $and: [{ branch: { $in: branchQuery } }, { class: { $in: classQuery } }] })
            if (students.length > 0) {
                res.status(200).json({ len: students.length, payload: students })
            } else {
                res.status(200).json({ message: "Student Not Found" })
            }
        } else if (classQuery && toQuery && branchQuery) {
            console.log("All Called !", classQuery, toQuery, branchQuery)
            /**
            * @limit @just 6-10
            * @class must be less than to
            * @if this limit cross so application create unexpected error and bugs
            */


            let start = Number.parseInt(classQuery);
            let end = Number.parseInt(toQuery);
            let Branch = branchQuery;
            let finalStudent = []
            let finalStudentsArray = []

            while (start <= end) {
                const students = await Student.find({ class: start })
                if (students) {
                    finalStudent.push(students)
                } else {
                    console.log('Student not found in class ', start)
                }

                start++;
            }

            for (let data of finalStudent) {
                if (data.length > 0) {
                    finalStudentsArray.push(...data)
                } else {
                    finalStudentsArray.push(data)
                }
            }

            let responseArray = []

            for (let data of finalStudentsArray) {
                if (data.branch === Branch) {
                    responseArray.push(data)

                }

            }

            if (responseArray.length > 0) {
                res.status(200).json({ len: responseArray.length, payload: responseArray })
            } else {
                res.status(404).json({ message: "Student No Found !" })
            }



        } else if (!classQuery && !toQuery && !branchQuery) {
            res.status(404).json({ message: "No Search query Provided" })
        } else if (classQuery && toQuery && !branchQuery) {
            console.log(`class and to query called ${classQuery} to ${toQuery}`)
            /**
             * @limit @just 6-10
             * @class must be less than to
             * @if this limit cross so application create unexpected error and bugs
             */
            let start = Number.parseInt(classQuery);
            let end = Number.parseInt(toQuery);
            let notFound = []
            let finalStudent = []
            let finalStudentsArray = []

            // -1 is for replace while loop
            // for (start - 1; start <= end; start++) {
            //     const students = await Student.find({ class: start })
            //     if (students) {
            //         finalStudent.push(students)
            //     } else {
            //         console.log('Student not found in class ', start)
            //     }
            // }

            while (start <= end) {
                const students = await Student.find({ class: start })
                if (students) {
                    finalStudent.push(students)
                } else {
                    console.log('Student not found in class ', start)
                }

                start++;
            }

            for (let data of finalStudent) {
                if (data.length > 0) {
                    finalStudentsArray.push(...data)
                } else {
                    finalStudentsArray.push(data)
                }
            }
            if (finalStudentsArray.length > 0) {
                res.status(200).json({ len: finalStudentsArray.length, payload: finalStudentsArray })
            } else {

                res.status(404).json({ message: "Student not Found" })
            }
        } else {
            res.status(200).json({ message: "This Search is not meaningfull !" })
        }

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

