import { useEffect, useState } from "react";
import { db } from "../../firebase";

export const useGetContestedQScore = (userUid) => {
  const [loadingContestedScore, setLoadingContestedScore] = useState(true);

  const [contestedScore, setContestedScore] = useState(0);

  useEffect(() => {
    const fetchContestedQ = async () => {
      db.getContestedScoreByUid(userUid)
        .then((res) => {
          return res.val(); //resolve promise
        })
        .then((result) => {
          if (result === null) {
            setContestedScore(0);
          } else {
            setContestedScore(Object.values(result).reduce((a, b) => a + b, 0));
          }
        });

      setLoadingContestedScore(false);
    };
    fetchContestedQ();
  }, [userUid]);

  return [contestedScore, loadingContestedScore];
};
