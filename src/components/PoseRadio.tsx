import { Form } from "react-bootstrap";

interface PoseRadioProps {
  pose: string;
  onPoseChange: (status: string) => void;
}

export const PoseRadio = ({ pose, onPoseChange }: PoseRadioProps) => {
  return (
    <Form style={{ textAlign: "left" }}>
      <Form.Group>
        <Form.Check
          type="radio"
          label="No Reconstruction"
          name="no_recon"
          id="no-recon"
          value="no_recon"
          checked={pose === "no_recon"}
          onChange={(e) => onPoseChange(e.target.value)}
          className="mb-3"
        />
        <Form.Check
          type="radio"
          label="Pending"
          name="pose"
          id="pose-pending"
          value="pending"
          checked={pose === "pending"}
          onChange={(e) => onPoseChange(e.target.value)}
          className="mb-3"
        />
        <Form.Check
          type="radio"
          label="Wrong"
          name="pose"
          id="pose-wrong"
          value="wrong"
          checked={pose === "wrong"}
          onChange={(e) => onPoseChange(e.target.value)}
          className="mb-3"
        />
        <Form.Check
          type="radio"
          label="Almost"
          name="pose"
          id="pose-almost"
          value="almost"
          checked={pose === "almost"}
          onChange={(e) => onPoseChange(e.target.value)}
          className="mb-3"
        />
        <Form.Check
          type="radio"
          label="Correct"
          name="pose"
          id="pose-approved"
          value="approved"
          checked={pose === "approved"}
          onChange={(e) => onPoseChange(e.target.value)}
          className="mb-3"
        />
      </Form.Group>
    </Form>
  );
};
