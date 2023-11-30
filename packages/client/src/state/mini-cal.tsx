import { createContext, useContext, useState } from 'react';

interface MiniCalContextState {
  followFocusedTime: boolean;
  setFollowFocusedTime: (follow: boolean) => void;
}

const MiniCalContext = createContext<MiniCalContextState | undefined>(
  undefined,
);

export const useMiniCalContext = () => {
  const context = useContext(MiniCalContext);
  if (context === undefined) {
    throw new Error('Using mini cal context without a provider');
  }

  return context;
};

export const MiniCalProvider: React.FC<React.PropsWithChildren> = (props) => {
  const [followFocusedTime, setFollowFocusedTime] = useState(true);

  return (
    <MiniCalContext.Provider
      value={{
        followFocusedTime,
        setFollowFocusedTime,
      }}
    >
      {props.children}
    </MiniCalContext.Provider>
  );
};
