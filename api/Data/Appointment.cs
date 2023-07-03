using Org.BouncyCastle.Asn1.Esf;

namespace api.Data
{
    public class Appointment
    {
        public Guid ID { get; set; }
        public string Staff_id { get; set; }
        public string Student_id { get; set; }
        public string DateTime { get; set; }

        public bool Approve { get; set; }
        public bool Pending { get; set; }
        public bool Complete { get; set; }
        public bool Cancel { get; set; }
        public string? Cancel_reason { get; set; }
        public string? Note { get; set; }
        public string? Staff_email { get; set; }
        public string? Student_email { get; set; }


        public Appointment(Guid id, string staff_id, string student_id, string datetime, 
                            bool approve, bool pending, bool complete, bool cancel, 
                            string cancel_reason, string note, string? staff_email, string? student_email)
        {
            ID = id;
            Staff_id = staff_id;
            Student_id = student_id;
            DateTime = datetime;
            Approve = approve;
            Pending = pending;
            Complete = complete;
            Cancel = cancel;
            Cancel_reason = cancel_reason;
            Note = note;
            Staff_email = staff_email;
            Student_email = student_email;
        }
        public Appointment()
        {
            ID = Guid.Empty;
            Staff_id = "";
            Student_id = "";
            DateTime = "";
            Approve = false;
            Pending = false;
            Complete = false;
            Cancel = false;
            Cancel_reason = "";
            Note = "";
            Staff_email = "";
            Student_email = "";
        }
    }
}
