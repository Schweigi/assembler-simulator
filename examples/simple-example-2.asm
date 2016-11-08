; Simple example No 2
; Printing out data at console and INC operation

JMP start

;ASCII

char_1:	DB 66
char_2:	DB 73 
char_3:	DB 83
string:	DB "BIS"
DB 0
;print out
	
start:	
	MOV D, 0xE8
	MOV B, char_1
	MOV C, [B]
	MOV [D], C

	INC D
	MOV B, char_2
	MOV C, [B]
	MOV [D], C

	INC D
	MOV B, char_3
	MOV C, [B]
	MOV [D], C

;2nd variant
	
	INC D
	INC B
	MOV C, [B]
	MOV [D], C

 	INC D
	INC B
	MOV C, [B]
	MOV [D], C

	INC D
	INC B
	MOV C, [B]
	MOV [D], C



HLT
