import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import InputBox from "../components/prem-chat/InputBox";
import ModelSelectionDropdown from "../components/prem-chat/ModelSelectionDropdown";
import UserReply from "../shared/components/UserReply";
import BotReply from "../shared/components/BotReply";
import usePremChat from "../shared/hooks/usePremChat";
import Sidebar from "../components/prem-chat/Sidebar";
import { useParams } from "react-router-dom";
import RegenerateButton from "../components/prem-chat/RegenerateButton";
import Header from "../components/prem-chat/Header";
import RightSidebar from "../components/prem-chat/RightSidebar";

import usePremChatStore from "../shared/store/prem-chat";
import Title from "../shared/components/Title";
import { shallow } from "zustand/shallow";

function PremChat() {
  const { chatId } = useParams();
  const [rightSidebar, setRightSidebar] = useState(false);
  const chatMessageListRef = useRef<HTMLDivElement>(null);

  const {
    chatMessages,
    onSubmit,
    question,
    setQuestion,
    isLoading,
    isError,
    onRegenerate,
  } = usePremChat(chatId || null);

  useEffect(() => {
    if (chatMessageListRef.current) {
      chatMessageListRef.current.scrollTop =
        chatMessageListRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const { model, setModel } = usePremChatStore(
    (state) => ({ model: state.model, setModel: state.setModel }),
    shallow
  );

  const onModelChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setModel(event.target.value);
    },
    [setModel]
  );

  return (
    <section>
      <div className="flex h-screen w-full relative">
        <div>
          <Sidebar />
        </div>
        <div className="flex flex-1">
          <div className="bg-lines bg-darkjunglegreen relative h-full w-full">
            <div
              className="main-content h-full z-10 relative max-h-full overflow-x-hidden scrollbar-none"
              ref={chatMessageListRef}
            >
              <Header
                setRightSidebar={setRightSidebar}
                rightSidebar={rightSidebar}
              />
              <div className="z-10 relative mt-[40px] flex flex-col prem-chat-body">
                <Title>Prem Chat</Title>
                <div className="prem-chat p-4 pb-7 md:w-[55%] w-[85%] mx-auto">
                  <p className="text-spanishgray text-base font-proximaNova-regular mb-[6px]">
                    Model
                  </p>
                  <ModelSelectionDropdown
                    model={model}
                    onModelChange={onModelChange}
                  />
                  {isError && <div>Something went wrong</div>}
                </div>
                <div className="md:w-[65%] w-[90%] mx-auto mt-8">
                  {chatMessages.map((message, index) => (
                    <div key={index}>
                      {message.role === "user" ? (
                        <UserReply reply={message.content} />
                      ) : (
                        <BotReply reply={message.content} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="prem-chat-bottom border-transparent bg-gradient-to-b from-transparent via-white to-white dark:via-[#20232B] dark:to-[#20232B]">
                  <div className="md:w-[55%] w-[85%] mx-auto">
                    {chatMessages.length > 0 && !isLoading && !isError && (
                      <div>
                        <RegenerateButton onRgenerateClick={onRegenerate} />
                      </div>
                    )}
                    <form className="text-center" onSubmit={onSubmit}>
                      <InputBox
                        question={question}
                        setQuestion={setQuestion}
                        disabled={isLoading || !model}
                        placeholder={
                          isLoading
                            ? "Fetching response..."
                            : model
                            ? "Type a message or type to select a prompt"
                            : "Please select a model to get started"
                        }
                      />
                    </form>
                    <p className="text-philippinegray mt-3 text-[10px] font-proximaNova-regular text-center">
                      ChatBot UI. Chat bot UI is an advanced chatbot kit for
                      OpenAI'a chat models aiming to mimic ChatGPT's interface
                      and functionality.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {rightSidebar && <RightSidebar setRightSidebar={setRightSidebar} />}
        </div>
      </div>
    </section>
  );
}

export default PremChat;
