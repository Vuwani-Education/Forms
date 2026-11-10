// ==========================================
// VUWANI LEADERSHIP & MENTORSHIP REGISTRATION
// ==========================================
// 1. selecting the html elements
const registrationForm = document.getElementById("registrationForm");
const attendance = document.getElementById("attendance");
const attendingSection = document.querySelector(".if-attending");
const studentSection = document.querySelector(".if-student");
const studentOptions = document.querySelectorAll('input[name="student"]');
const formMessage = document.getElementById("formMessage");

//2. Function to show or hide personal information fields based on attendance selection
function toggleAttendanceFields() {
    if (attendance.value === "yes") {
        attendingSection.hidden = false;
    } else {
        attendingSection.hidden = true;
        //clear personal information when not attending
        attendingSection.querySelectorAll("input, select").forEach(field => {
            field.value = "";
            field.disabled = true;
        });

        //clear student selection
        studentOptions.forEach(option => {
            option.checked = false;
        });
        toggleStudentFields(); // Hide student fields if not attending
    }
}

//3. Function to show or hide student fields based on student selection
function toggleStudentFields() {
    const selectedStudent = document.querySelector('input[name="student"]:checked');
    if (selectedStudent && selectedStudent.value === "yes") {
        studentSection.hidden = false;
        //Enable student-specific fields
        studentSection.querySelectorAll("input, select").forEach(field => {
            field.disabled = false;
        });
    } else {
        studentSection.hidden = true;
        //disable and clear student-specific fields
        studentSection.querySelectorAll("input, select").forEach(field => {
            field.value ="";
            field.disabled = true;
        });
    }
}

//check the email structure
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// 4. Listen for attendance selection changes
attendance.addEventListener("change", function() {
    toggleAttendanceFields();
    formMessage.textContent = "";
});

//5. Listen for student selection changes
studentOptions.forEach(option => {
    option.addEventListener("change", function() {
        toggleStudentFields();
        formMessage.textContent = "";
    });
});

//6. handle form submission
registrationForm.addEventListener("submit", function (event) {
    event.preventDefault();
    // Check whether the form is valid
    if (!registrationForm.checkValidity()) {
        registrationForm.reportValidity();
        return;
    }
    // Collect form information
    const formData = new FormData(registrationForm);
    const registration = {
        attendance: formData.get("attendance"),
        name: formData.get("name")?.trim() || "",
        surname: formData.get("surname")?.trim() || "",
        email: formData.get("email")?.trim() || "",
        phone: formData.get("phone")?.trim() || "",
        student: formData.get("student") || "",
        schoolname: formData.get("schoolname")?.trim() || "",
        grade: formData.get("grade") || "",
        registrationDate: new Date().toISOString()
    };
    // Validate phone number only for attendees
    if (registration.attendance === "yes") {
        const phoneDigits = registration.phone.replace(/\D/g, "");
        if (phoneDigits.length < 9 || phoneDigits.length > 12) {
            formMessage.textContent = "Please enter a valid phone number.";
            formMessage.style.color = "red";
            return;
        }
    }
    // validate email
    if (registration.attendance === "yes") {
        if (!validateEmail(registration.email)) {
            formMessage.textContent = "Please enter a valid email address.";
            formMessage.style.color = "red";
            return;
        }
    }
    // Display the collected information in the console
    console.log("Registration Details:", registration);
    // Display success feedback
    formMessage.textContent =
        "Form completed successfully! Your information has not yet been saved.";
    formMessage.style.color = "green";
});

//7. Clear feedback when the form is reset
registrationForm.addEventListener("reset", function() {
    setTimeout(function() {
        attendingSection.hidden = true;
        studentSection.hidden = true;
        //re-enable fields so they can be used again
        registrationForm.querySelectorAll("input, select").forEach(field => {
            field.disabled = false;
        });
        formMessage.textContent = "";
    }, 0);
});

toggleAttendanceFields();