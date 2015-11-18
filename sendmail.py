import smtplib

server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login("harris.baptiste@gmail.com", "vitanovaincipt")

msg = "This the way thing should work"
server.sendmail("dpatrov@gmail.com", "harris.baptiste@gmail.com", msg)
server.quit()