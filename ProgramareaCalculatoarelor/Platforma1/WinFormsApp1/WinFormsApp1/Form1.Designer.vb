<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Partial Class Form1
    Inherits System.Windows.Forms.Form

    'Form overrides dispose to clean up the component list.
    <System.Diagnostics.DebuggerNonUserCode()>
    Protected Overrides Sub Dispose(disposing As Boolean)
        Try
            If disposing AndAlso components IsNot Nothing Then
                components.Dispose()
            End If
        Finally
            MyBase.Dispose(disposing)
        End Try
    End Sub

    'Required by the Windows Form Designer
    Private components As System.ComponentModel.IContainer

    'NOTE: The following procedure is required by the Windows Form Designer
    'It can be modified using the Windows Form Designer.  
    'Do not modify it using the code editor.
    <System.Diagnostics.DebuggerStepThrough()>
    Private Sub InitializeComponent()
        components = New ComponentModel.Container()
        btnAdunare = New Button()
        btnScadere = New Button()
        btnInmultire = New Button()
        btnImpartire = New Button()
        btnStergere = New Button()
        btnIesire = New Button()
        txtNumar1 = New TextBox()
        txtNumar2 = New TextBox()
        txtRezultat = New TextBox()
        ContextMenuStrip1 = New ContextMenuStrip(components)
        Numar1 = New Label()
        Label1 = New Label()
        Label2 = New Label()
        SuspendLayout()
        ' 
        ' btnAdunare
        ' 
        btnAdunare.Location = New Point(-1, 192)
        btnAdunare.Name = "btnAdunare"
        btnAdunare.Size = New Size(75, 23)
        btnAdunare.TabIndex = 3
        btnAdunare.Text = "+"
        btnAdunare.UseVisualStyleBackColor = True
        ' 
        ' btnScadere
        ' 
        btnScadere.Location = New Point(151, 192)
        btnScadere.Name = "btnScadere"
        btnScadere.Size = New Size(75, 23)
        btnScadere.TabIndex = 4
        btnScadere.Text = "-"
        btnScadere.UseVisualStyleBackColor = True
        ' 
        ' btnInmultire
        ' 
        btnInmultire.Location = New Point(-1, 221)
        btnInmultire.Name = "btnInmultire"
        btnInmultire.Size = New Size(75, 23)
        btnInmultire.TabIndex = 5
        btnInmultire.Text = "*"
        btnInmultire.UseVisualStyleBackColor = True
        ' 
        ' btnImpartire
        ' 
        btnImpartire.Location = New Point(151, 221)
        btnImpartire.Name = "btnImpartire"
        btnImpartire.Size = New Size(75, 23)
        btnImpartire.TabIndex = 6
        btnImpartire.Text = "/"
        btnImpartire.UseVisualStyleBackColor = True
        ' 
        ' btnStergere
        ' 
        btnStergere.Location = New Point(-1, 308)
        btnStergere.Name = "btnStergere"
        btnStergere.Size = New Size(75, 23)
        btnStergere.TabIndex = 7
        btnStergere.Text = "Stergere"
        btnStergere.UseVisualStyleBackColor = True
        ' 
        ' btnIesire
        ' 
        btnIesire.Location = New Point(151, 308)
        btnIesire.Name = "btnIesire"
        btnIesire.Size = New Size(75, 23)
        btnIesire.TabIndex = 8
        btnIesire.Text = "Iesire"
        btnIesire.UseVisualStyleBackColor = True
        ' 
        ' txtNumar1
        ' 
        txtNumar1.Location = New Point(55, 12)
        txtNumar1.Name = "txtNumar1"
        txtNumar1.Size = New Size(100, 23)
        txtNumar1.TabIndex = 9
        ' 
        ' txtNumar2
        ' 
        txtNumar2.Location = New Point(55, 50)
        txtNumar2.Name = "txtNumar2"
        txtNumar2.Size = New Size(100, 23)
        txtNumar2.TabIndex = 10
        ' 
        ' txtRezultat
        ' 
        txtRezultat.Location = New Point(55, 93)
        txtRezultat.Name = "txtRezultat"
        txtRezultat.Size = New Size(100, 23)
        txtRezultat.TabIndex = 11
        ' 
        ' ContextMenuStrip1
        ' 
        ContextMenuStrip1.Name = "ContextMenuStrip1"
        ContextMenuStrip1.Size = New Size(61, 4)
        ' 
        ' Numar1
        ' 
        Numar1.AutoSize = True
        Numar1.Location = New Point(-1, 15)
        Numar1.Name = "Numar1"
        Numar1.Size = New Size(50, 15)
        Numar1.TabIndex = 13
        Numar1.Text = "Numar1"
        ' 
        ' Label1
        ' 
        Label1.AutoSize = True
        Label1.Location = New Point(-1, 53)
        Label1.Name = "Label1"
        Label1.Size = New Size(50, 15)
        Label1.TabIndex = 14
        Label1.Text = "Numar2"
        ' 
        ' Label2
        ' 
        Label2.AutoSize = True
        Label2.Location = New Point(0, 96)
        Label2.Name = "Label2"
        Label2.Size = New Size(49, 15)
        Label2.TabIndex = 15
        Label2.Text = "Rezultat"
        ' 
        ' Form1
        ' 
        AutoScaleDimensions = New SizeF(7F, 15F)
        AutoScaleMode = AutoScaleMode.Font
        ClientSize = New Size(398, 373)
        Controls.Add(Label2)
        Controls.Add(Label1)
        Controls.Add(Numar1)
        Controls.Add(txtRezultat)
        Controls.Add(txtNumar2)
        Controls.Add(txtNumar1)
        Controls.Add(btnIesire)
        Controls.Add(btnStergere)
        Controls.Add(btnImpartire)
        Controls.Add(btnInmultire)
        Controls.Add(btnScadere)
        Controls.Add(btnAdunare)
        Name = "Form1"
        Text = "Calculator de buzunar"
        ResumeLayout(False)
        PerformLayout()
    End Sub
    Friend WithEvents btnAdunare As Button
    Friend WithEvents btnScadere As Button
    Friend WithEvents btnInmultire As Button
    Friend WithEvents btnImpartire As Button
    Friend WithEvents btnStergere As Button
    Friend WithEvents btnIesire As Button
    Friend WithEvents txtNumar1 As TextBox
    Friend WithEvents txtNumar2 As TextBox
    Friend WithEvents txtRezultat As TextBox
    Friend WithEvents ContextMenuStrip1 As ContextMenuStrip
    Friend WithEvents Numar1 As Label
    Friend WithEvents Label1 As Label
    Friend WithEvents Label2 As Label

End Class
