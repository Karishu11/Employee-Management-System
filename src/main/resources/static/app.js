const baseUrl = "http://localhost:8080/api/v1/employees";
let editingEmployeeId = null; // Track the employee being edited

// Fetch and display employees
function fetchEmployees() {
    fetch(baseUrl)
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById("employeeList");
            list.innerHTML = "";
            data.forEach(employee => {
                list.innerHTML += `
                    <tr id="row-${employee.id}">
                        <td>${employee.name}</td>
                        <td>${employee.department}</td>
                        <td>${employee.email}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="loadEmployee(${employee.id}, '${employee.name}', '${employee.department}', '${employee.email}')">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${employee.id})">Delete</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error("Error fetching employees:", error));
}

// Add or update an employee
function addOrUpdateEmployee() {
    const name = document.getElementById("name").value.trim();
    const department = document.getElementById("department").value.trim();
    const email = document.getElementById("email").value.trim();

    // Validation: Check if fields are empty
    if (!name || !department || !email) {
        alert("All fields are required!");
        return;
    }

    const employeeData = { name, department, email };

    if (editingEmployeeId === null) {
        // Add new employee
        fetch(baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(employeeData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to add employee");
            }
            return response.json();
        })
        .then(() => {
            fetchEmployees();
            clearForm();
        })
        .catch(error => console.error("Error adding employee:", error));
    } else {
        // Update existing employee
        fetch(`${baseUrl}/${editingEmployeeId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(employeeData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to update employee");
            }
            return response.json();
        })
        .then(() => {
            fetchEmployees();
            clearForm();
        })
        .catch(error => console.error("Error updating employee:", error));

        editingEmployeeId = null;
        document.getElementById("addBtn").innerText = "Add Employee";
    }
}

// Load an employee's details into the form for editing
function loadEmployee(id, name, department, email) {
    document.getElementById("name").value = name;
    document.getElementById("department").value = department;
    document.getElementById("email").value = email;

    editingEmployeeId = id;
    document.getElementById("addBtn").innerText = "Update Employee";
}

// Delete an employee
function deleteEmployee(id) {
    if (confirm("Are you sure you want to delete this employee?")) {
        fetch(`${baseUrl}/${id}`, { method: "DELETE" })
            .then(() => fetchEmployees())
            .catch(error => console.error("Error deleting employee:", error));
    }
}

// Clear form fields and reset the form
function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("department").value = "";
    document.getElementById("email").value = "";

    editingEmployeeId = null;
    document.getElementById("addBtn").innerText = "Add Employee";
}
