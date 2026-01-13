import { Form } from "react-bootstrap";

interface VideoStatusRadioProps {
  videoStatus: string;
  onStatusChange: (status: string) => void;
}

export const VideoStatusRadio = ({
  videoStatus,
  onStatusChange,
}: VideoStatusRadioProps) => {
  return (
    <Form style={{ textAlign: "left" }}>
      <Form.Group>
        <Form.Check
          type="radio"
          label="No Reconstruction"
          name="no_recon"
          id="no-recon"
          value="no_recon"
          checked={videoStatus === "no_recon"}
          onChange={(e) => onStatusChange(e.target.value)}
          className="mb-3"
        />
        <Form.Check
          type="radio"
          label="Pending"
          name="status"
          id="status-pending"
          value="pending"
          checked={videoStatus === "pending"}
          onChange={(e) => onStatusChange(e.target.value)}
          className="mb-3"
        />
        <Form.Check
          type="radio"
          label="Wrong objects"
          name="status"
          id="status-object"
          value="object"
          checked={videoStatus === "object"}
          onChange={(e) => onStatusChange(e.target.value)}
          className="mb-3"
        />
        <Form.Check
          type="radio"
          label="Wrong pose"
          name="status"
          id="status-pose"
          value="pose"
          checked={videoStatus === "pose"}
          onChange={(e) => onStatusChange(e.target.value)}
          className="mb-3"
        />
        <Form.Check
          type="radio"
          label="Approved"
          name="status"
          id="status-approved"
          value="approved"
          checked={videoStatus === "approved"}
          onChange={(e) => onStatusChange(e.target.value)}
          className="mb-3"
        />
      </Form.Group>
    </Form>
  );
};
