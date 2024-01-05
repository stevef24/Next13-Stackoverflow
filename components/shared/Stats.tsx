import React from "react";
import { Interface } from "readline";

interface StatsProps {
	totalQuestions: number;
	totalAnswers: number;
}
const Stats = ({ totalAnswers, totalQuestions }: StatsProps) => {
	return <div>Stats</div>;
};

export default Stats;
