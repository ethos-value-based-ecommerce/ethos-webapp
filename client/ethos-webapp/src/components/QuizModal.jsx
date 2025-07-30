import { useState } from "react";
import { Modal, Steps, Checkbox, Radio, Button, Typography, message } from "antd";
import "../styling/colors.css";
import "../styling/ReccomendationPage.css";

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

      // Format the preferences object to match what the backend expects
      const preferences = {
        ownership: answers.ownership || [],
        categories: answers.productCategory || [],
        socialResponsibility: answers.socialResponsibility || "no",
        ethics: answers.ethicalPractices || [],
        environmentalPractices: answers.environmentalPractices || []
      };

      console.log("Storing preferences in localStorage:", preferences);

      // Store preferences in localStorage for future use
      localStorage.setItem('quizPreferences', JSON.stringify(preferences));

      // Close the modal first
      onClose();

      // Then submit answers and navigate with justCompletedQuiz flag
      setTimeout(() => {
        onSubmit(answers, true); // Pass true to indicate quiz was just completed
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
      title={<div className="recommendation-modal-title">Brand Values Quiz</div>}
      centered
      width={750}
      footer={null}
      className="recommendation-modal"
      styles={{
        header: {
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '16px',
          marginBottom: '8px'
        },
        body: {
          padding: '24px 32px'
        },
        mask: {
          backdropFilter: 'blur(4px)',
          background: 'rgba(0, 0, 0, 0.45)'
        }
      }}
    >
      <Steps
        current={current}
        size="small"
        progressDot
        items={quizSteps.map((s) => ({ title: s.title, key: s.key }))}
        className="quiz-steps"
      />

      <div className="quiz-step-enter quiz-step-content" key={current}>
        <Title level={4} className="quiz-question-title">{step.title}</Title>
        <Text className="quiz-question-text">{step.question}</Text>

        <div className="quiz-options-container">
          {step.multiple ? (
            <Checkbox.Group
              value={answers[step.key]}
              onChange={handleChange}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              {step.options.map((option) => (
                <Checkbox
                  key={option.value}
                  value={option.value}
                  className="quiz-option"
                >
                  {option.label}
                </Checkbox>
              ))}
            </Checkbox.Group>
          ) : (
            <Radio.Group
              value={answers[step.key]}
              onChange={handleChange}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              {step.options.map((option) => (
                <Radio
                  key={option.value}
                  value={option.value}
                  className="quiz-option"
                >
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
          )}
        </div>
      </div>

      <div className="quiz-button-container">
        <Button
          onClick={prev}
          disabled={current === 0}
          className={current > 0 ? "quiz-option quiz-back-button" : "quiz-back-button"}
        >
          Back
        </Button>
        <Button
          type="primary"
          onClick={next}
          className="quiz-option quiz-next-button"
        >
          {current === quizSteps.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </Modal>
  );
};

export default QuizModal;
