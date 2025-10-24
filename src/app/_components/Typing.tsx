"use client";
import React from "react";
import Typed from 'typed.js'

const defaultWords = [
	'student',
	'programmer',
	'tinkerer',
	'builder',
	'engineer',
];

type Props = {
	strings?: string[];
	className?: string;
	typeSpeed?: number;
	backSpeed?: number;
	backDelay?: number;
	startDelay?: number;
	loop?: boolean;
	cursorChar?: string;
  onPreStringTyped?: (index: number, value: string) => void;
};

class Typing extends React.Component<Props> {

	private el: HTMLSpanElement | null = null;
	private typed: Typed | null = null;

	componentDidMount() {
		const options = {
			strings: this.props.strings ?? defaultWords,
			typeSpeed: this.props.typeSpeed ?? 50,
			backSpeed: this.props.backSpeed ?? 50,
			backDelay: this.props.backDelay ?? 800,
			startDelay: this.props.startDelay ?? 0,
			loop: this.props.loop ?? true,
			cursorChar: this.props.cursorChar ?? "|",
			preStringTyped: (arrayPos: number) => {
				try {
					const list = (this.props.strings ?? defaultWords);
					const value = list[arrayPos] ?? '';
					this.props.onPreStringTyped?.(arrayPos, value);
				} catch {}
			},
		};
		// this.el refers to the <span> in the render() method
		this.typed = new Typed(this.el!, options as any);
	}
	componentWillUnmount() {
		// Please don't forget to cleanup animation layer
		this.typed?.destroy();
	}

		render() {
			return (
				<span
					className={this.props.className}
					style={{ whiteSpace: "normal" }}
					ref={(el) => {
						this.el = el;
					}}
				/>
			);
		}
}
export default Typing;