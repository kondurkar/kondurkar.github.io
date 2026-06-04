import { FilledTile, EmptyTile } from "./Tile";

export default function Puzzle({ shuffledArray, dragOver, dragStart, dropped }){
	return (
		<div className="grid grid-cols-4 gap-8 mt-6 px-6 rounded">
		{shuffledArray.map((value, index) => {
		if (value === "")
			return (
			<EmptyTile dragOver={dragOver} dropped={dropped} index={index} key={index}/>
			);
		return (
			<FilledTile index={index} value={value} dragStart={dragStart} key={index}/>
		);
		})}
	</div>
	)
}