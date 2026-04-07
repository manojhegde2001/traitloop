'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Progress } from '@nextui-org/progress';
import confetti from 'canvas-confetti';
import { useRouter } from '@/navigation';

import { CloseIcon, InfoIcon } from '@/components/icons';
import { type Question } from '@bigfive-org/questions';
import { sleep, formatTimer, isDev } from '@/lib/helpers';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import useTimer from '@/hooks/useTimer';
import { type Answer } from '@/types';
import { Card, CardBody } from '@nextui-org/card';
import { cn } from '@nextui-org/react';

interface SurveyProps {
  questions: Question[];
  nextText: string;
  prevText: string;
  resultsText: string;
  saveTest: Function;
  language: string;
}

export const Survey = ({
  questions,
  nextText,
  prevText,
  resultsText,
  saveTest,
  language
}: SurveyProps) => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsPerPage, setQuestionsPerPage] = useState(1);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);
  const [restored, setRestored] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const { width } = useWindowDimensions();
  const seconds = useTimer();

  useEffect(() => {
    const handleResize = () => {
      setQuestionsPerPage(window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width]);

  useEffect(() => {
    const restoreData = () => {
      if (dataInLocalStorage()) {
        restoreDataFromLocalStorage();
      }
    };
    restoreData();
  }, []);

  const currentQuestions = useMemo(
    () =>
      questions.slice(
        currentQuestionIndex,
        currentQuestionIndex + questionsPerPage
      ),
    [currentQuestionIndex, questions, questionsPerPage]
  );

  const isTestDone = questions.length === answers.length;
  const progress = Math.round((answers.length / questions.length) * 100);

  const nextButtonDisabled =
    inProgress ||
    currentQuestionIndex + questionsPerPage > answers.length ||
    (isTestDone &&
      currentQuestionIndex === questions.length - questionsPerPage) ||
    loading;

  const backButtonDisabled = currentQuestionIndex === 0 || loading;

  async function handleAnswer(id: string, value: string) {
    const question = questions.find((question) => question.id === id);
    if (!question) return;

    const newAnswer: Answer = {
      id,
      score: Number(value),
      domain: question.domain,
      facet: question.facet
    };

    setAnswers((prevAnswers: Answer[]) => [
      ...prevAnswers.filter((a: Answer) => a.id !== id),
      newAnswer
    ]);

    const latestAnswerId = answers.slice(-1)[0]?.id;

    if (
      questionsPerPage === 1 &&
      questions.length !== answers.length + 1 &&
      id !== latestAnswerId
    ) {
      setInProgress(true);
      await sleep(600);
      setCurrentQuestionIndex((prev: number) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setInProgress(false);
    }
    populateDataInLocalStorage();
  }

  function handlePreviousQuestions() {
    setCurrentQuestionIndex((prev: number) => prev - questionsPerPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleNextQuestions() {
    if (inProgress) return;
    setCurrentQuestionIndex((prev: number) => prev + questionsPerPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (restored) setRestored(false);
  }

  async function submitTest() {
    setLoading(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#ec4899']
    });
    
    await sleep(500);

    const result = await saveTest({
      testId: 'b5-120',
      language: language, // changed from lang to language to match interface if needed, check DB later
      invalid: false,
      timeElapsed: seconds,
      dateStamp: new Date(),
      answers
    });
    
    localStorage.removeItem('inProgress');
    localStorage.removeItem('b5data');
    router.push(`/result/${result.id}`);
  }

  function dataInLocalStorage() { return !!localStorage.getItem('inProgress'); }

  function populateDataInLocalStorage() {
    localStorage.setItem('inProgress', 'true');
    localStorage.setItem('b5data', JSON.stringify({ answers, currentQuestionIndex }));
  }

  function restoreDataFromLocalStorage() {
    const data = localStorage.getItem('b5data');
    if (data) {
      const { answers: storedAnswers, currentQuestionIndex: storedIndex } = JSON.parse(data);
      setAnswers(storedAnswers);
      setCurrentQuestionIndex(storedIndex);
      setRestored(true);
    }
  }

  function clearDataInLocalStorage() {
    localStorage.removeItem('inProgress');
    localStorage.removeItem('b5data');
    location.reload();
  }

  return (
    <div className='max-w-6xl mx-auto px-4 pb-24 font-sans'>
      {/* Header Sticky Progress */}
      <div className="sticky top-16 z-30 pt-8 pb-4 bg-background/80 backdrop-blur-md -mx-4 px-4 mb-12">
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
               <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Live Assessment</span>
               </div>
               <span className="text-4xl font-display font-black tracking-tighter">{progress}% <span className="text-default-300 text-2xl">Complete</span></span>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-default-400 mb-1">Session Progress</span>
               <div className="px-3 py-1 rounded-full bg-default-100 text-sm font-mono font-bold border border-divider/50">
                 {formatTimer(seconds)}
               </div>
            </div>
          </div>
          <Progress
            aria-label='Assessment Progress'
            value={progress}
            className='w-full'
            size='md'
            radius="full"
            classNames={{
              indicator: "bg-gradient-to-r from-primary via-secondary to-primary shadow-[0_0_15px_rgba(var(--nextui-primary-rgb),0.4)]"
            }}
          />
        </div>
      </div>

      {restored && (
        <Card className='mb-12 glass border-warning/30 bg-warning/5 animate-in slide-in-from-top-8 duration-700 max-w-4xl mx-auto shadow-2xl'>
          <CardBody className='flex flex-row items-center justify-between py-6 px-8 gap-6'>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-warning/20 flex items-center justify-center text-warning shadow-inner">
                <InfoIcon size={24} />
              </div>
              <div className="flex flex-col">
                <p className="text-lg font-bold">Session Restored</p>
                <p className="text-default-500 text-sm">We&apos;ve picked up right where you left off. <button onClick={clearDataInLocalStorage} className="text-warning font-black hover:underline underline-offset-4">Restart instead?</button></p>
              </div>
            </div>
            <Button isIconOnly variant='light' size="md" radius="full" onClick={() => setRestored(false)}>
              <CloseIcon size={20} />
            </Button>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-1 gap-12 max-w-4xl mx-auto relative min-h-[500px]">
        {currentQuestions.map((question: Question, qIdx: number) => {
           const currentAnswer = answers.find((a: Answer) => a.id === question.id);
           return (
            <div 
              key={'q' + question.num}
              className={cn(
                "transition-all duration-700 ease-out",
                inProgress ? "opacity-0 translate-y-8 scale-95" : "opacity-100 translate-y-0 scale-100"
              )}
              style={{ transitionDelay: `${qIdx * 150}ms` }}
            >
              <Card className={cn(
                "glass-card border-divider/30 shadow-2xl overflow-visible transition-all duration-500",
                currentAnswer ? "border-primary/40 bg-primary/[0.02]" : "hover:border-primary/20"
              )}>
                <CardBody className="p-8 md:p-14">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-display font-black text-2xl shadow-xl">
                        {question.num}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Trait Assessment</span>
                      <div className="h-[2px] w-24 bg-gradient-to-r from-primary to-transparent rounded-full" />
                    </div>
                  </div>
                  
                  <h2 className='text-3xl md:text-5xl font-display font-black leading-[1.1] mb-14 tracking-tighter text-default-900'>
                    {question.text}
                  </h2>

                  <div className="grid grid-cols-1 gap-5">
                    {question.choices.map((choice: any, index: number) => {
                      const isSelected = currentAnswer?.score === choice.score;
                      return (
                        <button
                          key={index + question.id}
                          onClick={() => handleAnswer(question.id, choice.score.toString())}
                          disabled={inProgress}
                          className={cn(
                            "group relative flex items-center justify-between p-7 rounded-[2rem] border-2 transition-all duration-500 text-left",
                            isSelected 
                              ? "bg-primary border-primary shadow-[0_20px_40px_rgba(var(--nextui-primary-rgb),0.25)] -translate-y-1" 
                              : "bg-default-50/30 border-divider/40 hover:border-primary/30 hover:bg-default-100/50 hover:-translate-y-1"
                          )}
                        >
                          <span className={cn(
                            "text-xl font-bold transition-colors tracking-tight",
                            isSelected ? "text-white" : "text-default-700 group-hover:text-primary"
                          )}>
                            {choice.text}
                          </span>
                          <div className={cn(
                            "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                            isSelected ? "bg-white border-white scale-110" : "border-primary/20 group-hover:border-primary group-hover:scale-110"
                          )}>
                            <div className={cn(
                              "w-3 h-3 rounded-full transition-all duration-500",
                              isSelected ? "bg-primary scale-100" : "bg-primary/0 scale-0"
                            )} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            </div>
           );
        })}
      </div>

      <div className='mt-16 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8 animate-in slide-in-from-bottom-8 duration-1000'>
        <div className="flex items-center gap-4">
          <Button
            variant="flat"
            radius="full"
            size="lg"
            className="h-16 px-10 font-black tracking-tight text-lg glass"
            isDisabled={backButtonDisabled}
            onClick={handlePreviousQuestions}
          >
            {prevText}
          </Button>

          <Button
            variant="shadow"
            color="primary"
            radius="full"
            size="lg"
            className="h-16 px-10 font-black tracking-tight text-lg"
            isDisabled={nextButtonDisabled}
            onClick={handleNextQuestions}
          >
            {nextText}
          </Button>
        </div>

        {isTestDone ? (
          <Button
            size="lg"
            radius="full"
            className="h-16 px-14 font-black text-2xl bg-gradient-to-r from-primary to-secondary text-white shadow-[0_20px_50px_rgba(var(--nextui-primary-rgb),0.3)] hover:scale-105 active:scale-95 transition-all animate-pulse-subtle"
            onClick={submitTest}
            isLoading={loading}
          >
            {resultsText}
          </Button>
        ) : (
          isDev && (
            <Button 
              variant="light" 
              size="sm" 
              radius="full"
              className="opacity-30 hover:opacity-100 font-black tracking-[0.2em] text-[10px]"
              onClick={() => {
                const randomAnswers = questions.map(q => ({
                  id: q.id,
                  score: Math.floor(Math.random() * 5) + 1,
                  domain: q.domain,
                  facet: q.facet
                }));
                setAnswers(randomAnswers);
                setCurrentQuestionIndex(questions.length - (questions.length % questionsPerPage || questionsPerPage));
              }}
            >
              DEBUG: AUTOFILL
            </Button>
          )
        )}
      </div>
    </div>
  );
};
