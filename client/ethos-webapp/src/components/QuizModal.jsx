import { useState } from "react";
import { Modal, Steps, Checkbox, Radio, Button, Typography, message } from "antd";

const { Step } = Steps;
const { Title, Text } = Typography;

// Defining the quiz steps and options.
const quizSteps = [
  {
    title: "Ownership",
    key: "ownership",
    question: "What type of ownership is important to you? (Select all that apply)",
    multiple: true,
    options: [
      { label: "Black-Owned", value: "black-owned" },
      { label: "Woman-Founded", value: "woman-founded" },
      { label: "Asian-Owned", value: "asian-owned" },
      { label: "LGBTQ+-Owned", value: "lgbtq-owned" },
      { label: "Disability-Owned", value: "disability-owned" },
      { label: "Latin-Owned", value: "latin-owned" },
      { label: "Indigenous-Owned", value: "indigenous-owned" },
      { label: "Minority-Founded", value: "minority-founded" },
      { label: "Underrepresented Group-Founded", value: "underrepresented-founded" },
    ],
  },
  {
    title: "Product Category",
    key: "productCategory",
    question: "What category of brands are you interested in? (Select all that apply)",
    multiple: true,
    options: [
      { label: "Beauty", value: "beauty" },
      { label: "Personal Care", value: "personal-care" },
      { label: "Clothing", value: "clothing" },
      { label: "Footwear", value: "footwear" },
      { label: "Handbags", value: "handbags" },
      { label: "Outdoor Gear", value: "outdoor-gear" },
      { label: "Home Decor", value: "home-decor" },
      { label: "Electronics", value: "electronics" },
    ],
  },
  {
    title: "Social Responsibility",
    key: "socialResponsibility",
    question: "Do you care about social responsibility in the brands you support?",
    multiple: false,
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    title: "Ethical Practices",
    key: "ethicalPractices",
    question: "Which of the following ethical practices do you care about? (Select all that apply)",
    multiple: true,
    options: [
      { label: "Clean Ingredients", value: "clean-ingredients" },
      { label: "Vegan", value: "vegan" },
      { label: "Cruelty-Free", value: "cruelty-free" },
    ],
  },
  {
    title: "Environmental Practices",
    key: "environmentalPractices",
    question: "Do you care if a brand follows any of these environmental practices? (Select all that apply)",
    multiple: true,
    options: [
      { label: "Zero-Waste", value: "zero-waste" },
      { label: "Carbon Neutral", value: "carbon-neutral" },
      { label: "Eco-Conscious", value: "eco-conscious" },
      { label: "Sustainable", value: "sustainable" },
    ],
  },
];

// Function to render the quiz model component, with questions and answers.
const QuizModal = ({ isOpen, onClose, onSubmit }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({
    ownership: [],
    productCategory: [],
    socialResponsibility: "",
    ethicalPractices: [],
    environmentalPractices: [],
  });

  const step = quizSteps[current];

  const handleChange = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [step.key]: step.multiple ? value : value.target.value,
    }));
  };

  const next = () => {
    if (current < quizSteps.length - 1) {
      setCurrent(current + 1);
    } else {
      message.success("Quiz completed! Generating recommendations...");
      // Close the modal first
      onClose();
      // Then submit answers and navigate
      setTimeout(() => {
        onSubmit(answers);
        console.log("Quiz completed, onSubmit called with answers:", answers);
      }, 100);
    }
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title="Brand Values Quiz"
      centered
      width={600}
      footer={null}
    >
      <Steps current={current} size="small" style={{ marginBottom: 24 }}>
        {quizSteps.map((s) => (
          <Step key={s.key} title={s.title} />
        ))}
      </Steps>

      <div>
        <Title level={4}>{step.title}</Title>
        <Text>{step.question}</Text>

        <div style={{ marginTop: 16 }}>
          {step.multiple ? (
            <Checkbox.Group
              options={step.options}
              value={answers[step.key]}
              onChange={handleChange}
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            />
          ) : (
            <Radio.Group
              options={step.options}
              value={answers[step.key]}
              onChange={handleChange}
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            />
          )}
        </div>
      </div>

      <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}>
        <Button onClick={prev} disabled={current === 0}>
          Back
        </Button>
        <Button type="primary" onClick={next}>
          {current === quizSteps.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </Modal>
  );
};

export default QuizModal;
