<?php
  $userInput = "";
  $loading = false;

  $messages = [
    ["role" => "assistant", "content" => "Welcome to Eibil's AutoGrader, You can find the questions under the chatbox."]
  ];

  $messageListRef = null;
  $textAreaRef = null;

  if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $userInput = $_POST["userInput"];
    handleSubmit();
  }

  // Auto scroll chat to bottom
  function scrollToBottom() {
    // Logic to scroll to the bottom of the chat
  }

  // Focus on text field on load
  function focusOnTextField() {
    // Logic to focus on the text field
  }

  // Handle errors
  function handleError() {
    global $messages, $loading, $userInput;
    $messages[] = ["role" => "assistant", "content" => "Oops! There seems to be an error. Please try again."];
    $loading = false;
    $userInput = "";
  }

  // Handle form submission
  function handleSubmit() {
    global $userInput, $loading, $messages;
    if (trim($userInput) === "") {
      return;
    }

    $loading = true;

    // Add predefined prompt
    $prompt = "I want you to ACT like a High School English Teacher. Your purpose is to... ";

    $context = array_merge($messages, [
      ["role" => "user", "content" => $prompt . $userInput]
    ]);
    $messages = $context;

    // Send chat history to API
    // Use appropriate logic to make the API request and handle the response

    // Reset user input
    $userInput = "";

    // Handle API response and update messages and loading state accordingly
    // Use appropriate logic to handle the API response
  }

  // Prevent blank submissions and allow for multiline input
  function handleEnter() {
    // Logic to handle the Enter key press event
  }

  // Perform initial setup
  focusOnTextField();
?>

<!DOCTYPE html>
<html>
<head>
  <title>GradeFlow</title>
  <meta name="description" content="GPT-4 interface" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" href="/favicon.ico" />
</head>
<body>
  <div class="topnav">
    <div class="navlogo"></div>
    <div class="navlinks"></div>
  </div>
  <main class="main">
    <div class="cloud">
      <div class="messagelist">
        <?php foreach ($messages as $index => $message) {
          if ($message["role"] === "assistant") { ?>
            <div class="apimessage">
              <img src="/openai.png" alt="AI" width="30" height="30" class="boticon" />
              <div class="markdownanswer">
                <?php echo $message["content"]; ?>
              </div>
            </div>
          <?php }
        } ?>
      </div>
    </div>
    <div class="center">
      <div class="cloudform">
        <form method="post" action="">
          <input
            <?php if ($loading) echo "disabled"; ?>
            onKeyDown="handleEnter(event)"
            autofocus="false"
            type="text"
            id="userInput"
            name="userInput"
            value="<?php echo htmlspecialchars($userInput); ?>"
            placeholder="<?php echo $loading ? 'Waiting for response...' : 'Please paste in the paragraph/essay...'; ?>"
            class="inputfield"
          />
          <button
            type="submit"
            <?php if ($loading) echo "disabled"; ?>
            class="generatebutton"
          >
            <?php if ($loading) { ?>
              <div class="loadingwheel">
                <!-- Logic for rendering the loading wheel -->
              </div>
            <?php } else { ?>
              <!-- Send icon SVG in input field -->
              <svg viewBox='0 0 20 20' class="svgicon" xmlns='http://www.w3.org/2000/svg'>
                <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z'></path>
              </svg>
            <?php } ?>
          </button>
        </form>
      </div>
      <div class="footer"></div>
    </div>
  </main>
</body>
</html>
