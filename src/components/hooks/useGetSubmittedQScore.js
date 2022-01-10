import { useEffect, useState } from "react";
import { db } from "../../firebase";

export const useGetSubmittedQScore = (userUid) => {
  const [loadingSubmittedScore, setLoadingSubmittedScore] = useState(true);

  const [submittedScore, setSubmittedScore] = useState(0);

  useEffect(() => {
    const fetchedSubmittedQ = async () => {
      db.getSubmittedScoreByUid(userUid)
        .then((res) => {
          return res.val(); //resolve promise
        })
        .then((result) => {
          if (result === null) {
            setSubmittedScore(0);
          } else {
            setSubmittedScore(Object.values(result).reduce((a, b) => a + b, 0));
          }
        });

      setLoadingSubmittedScore(false);
    };
    fetchedSubmittedQ();
  }, [userUid]);

  return [submittedScore, loadingSubmittedScore];
};
