// create Complaint
// post request for complaints 'https://admin.sawabuildgaza.com/api/complaints'

const bodyRequest = {
    "damage_report_id": 230,
    "description": "fdfjddkdkjnvdkfjbndkfjnbkjs djssd sd"
}

const responseForCreateComplaint = {
    "status": true,
    "code": 201,
    "message": "Complaint submitted successfully",
    "complaint": {
        "citizen_id": 1,
        "damage_report_id": 26,
        "neighborhood_id": 4,
        "description": "fdfjddkdkjnvdkfjbndkfjnbkjs djssd sd",
        "status": "PENDING",
        "current_level": 1,
        "assigned_to_user_id": null,
        "sla_deadline": "2026-03-15T22:25:50.000000Z",
        "code": "COMP-2026-6AAODX",
        "updated_at": "2026-03-12T22:25:50.000000Z",
        "created_at": "2026-03-12T22:25:50.000000Z",
        "id": 1,
        "status_label_en": "Your complaint has been received and is under review.",
        "status_label_ar": "تم استلام شكواك وهي قيد المراجعة.",
        "current_handler_role": "district_supervisor",
        "assigned_to": null,
        "damage_report": {
            "id": 26,
            "report_code": "GAZA-2026-6A9G9T"
        },
        "escalations": []
    }
}

// List my Complaints
// GET 'https://admin.sawabuildgaza.com/api/complaints'

const responseForGetComplaint = {
    "status": true,
    "code": 200,
    "message": "Complaints retrieved successfully",
    "data": {
        "complaints": [
            {
                "id": 1,
                "code": "COMP-2026-6AAODX",
                "description": "fdfjddkdkjnvdkfjbndkfjnbkjs djssd sd",
                "status": "PENDING",
                "current_level": 1,
                "assigned_to_user_id": null,
                "sla_deadline": "2026-03-15T22:25:50.000000Z",
                "created_at": "2026-03-12T22:25:50.000000Z",
                "updated_at": "2026-03-12T22:25:50.000000Z",
                "status_label_en": "Your complaint has been received and is under review.",
                "status_label_ar": "تم استلام شكواك وهي قيد المراجعة.",
                "current_handler_role": "district_supervisor",
                "assigned_to": null,
                "damage_report": {
                    "id": 26,
                    "report_code": "GAZA-2026-6A9G9T"
                },
                "escalations": []
            },
            {
                "id": 2,
                "code": "COMP-2026-6AAOEX",
                "description": "fdfjddkdkjnvdkfjbndkfjnbkjs djssd sd",
                "status": "PENDING",
                "current_level": 1,
                "assigned_to_user_id": null,
                "sla_deadline": "2026-03-15T22:25:50.000000Z",
                "created_at": "2026-03-12T22:25:50.000000Z",
                "updated_at": "2026-03-12T22:25:50.000000Z",
                "status_label_en": "Your complaint has been received and is under review.",
                "status_label_ar": "تم استلام شكواك وهي قيد المراجعة.",
                "current_handler_role": "district_supervisor",
                "assigned_to": null,
                "damage_report": {
                    "id": 26,
                    "report_code": "GAZA-2026-6A9G9T"
                },
                "escalations": []
            }
        ],
        "pagination": {
            "total": 2,
            "per_page": 15,
            "current_page": 1,
            "last_page": 1,
            "from": 1,
            "to": 2
        }
    }
}


//Close Complaint
//Put 'https://admin.sawabuildgaza.com/api/complaints/{id}/close'

const responseForCloseComplaint = {
    "status": true,
    "code": 200,
    "message": "Complaint closed successfully",
    "complaint": {
        "id": 1,
        "code": "COMP-2026-6AAODX",
        "description": "fdfjddkdkjnvdkfjbndkfjnbkjs djssd sd",
        "status": "CLOSED",
        "current_level": 1,
        "assigned_to_user_id": null,
        "sla_deadline": "2026-03-15T22:25:50.000000Z",
        "created_at": "2026-03-12T22:25:50.000000Z",
        "updated_at": "2026-03-12T22:25:50.000000Z",
        "status_label_en": "Your complaint has been closed.",
        "status_label_ar": "تم إغلاق شكواك.",
        "current_handler_role": "district_supervisor",
        "assigned_to": null,
        "damage_report": {
            "id": 26,
            "report_code": "GAZA-2026-6A9G9T"
        },
        "escalations": []
    }
}


// View Complaint Details
// GET 'https://admin.sawabuildgaza.com/api/complaints/{id}'

const responseForViewComplaint = {
    "status": true,
    "code": 200,
    "message": "Complaint retrieved successfully",
    "complaint": {
        "id": 1,
        "code": "COMP-2026-6AAODX",
        "citizen_id": 1,
        "damage_report_id": 26,
        "neighborhood_id": 4,
        "description": "fdfjddkdkjnvdkfjbndkfjnbkjs djssd sd",
        "status": "PENDING",
        "current_level": 1,
        "assigned_to_user_id": null,
        "sla_deadline": "2026-03-15T22:25:50.000000Z",
        "response": null,
        "responded_by": null,
        "responded_at": null,
        "internal_notes": null,
        "resolution_type": null,
        "resolved_at": null,
        "closed_at": null,
        "created_at": "2026-03-12T22:25:50.000000Z",
        "updated_at": "2026-03-12T22:25:50.000000Z",
        "deleted_at": null,
        "status_label_en": "Your complaint has been received and is under review.",
        "status_label_ar": "تم استلام شكواك وهي قيد المراجعة.",
        "current_handler_role": "district_supervisor",
        "assigned_to": null,
        "damage_report": {
            "id": 26,
            "report_code": "GAZA-2026-6A9G9T",
            "status": "SUBMITTED"
        },
        "escalations": []
    }
}


