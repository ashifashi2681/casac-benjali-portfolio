import React from 'react'

function Desc({ data, ...props }) {
	return (
		<p
			{...props}
			dangerouslySetInnerHTML={{ __html: data || "" }}
			className="text-base leading-[1.65] text-foreground-secondary"
		/>
	);
}

export default Desc