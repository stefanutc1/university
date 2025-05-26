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
        ListBox1 = New ListBox()
        ListBox2 = New ListBox()
        Button1 = New Button()
        Button2 = New Button()
        Button3 = New Button()
        Button4 = New Button()
        SuspendLayout()
        ' 
        ' ListBox1
        ' 
        ListBox1.FormattingEnabled = True
        ListBox1.ItemHeight = 15
        ListBox1.Location = New Point(12, 12)
        ListBox1.Name = "ListBox1"
        ListBox1.Size = New Size(120, 379)
        ListBox1.TabIndex = 0
        ' 
        ' ListBox2
        ' 
        ListBox2.FormattingEnabled = True
        ListBox2.ItemHeight = 15
        ListBox2.Location = New Point(557, 12)
        ListBox2.Name = "ListBox2"
        ListBox2.Size = New Size(120, 379)
        ListBox2.TabIndex = 1
        ' 
        ' Button1
        ' 
        Button1.Location = New Point(273, 12)
        Button1.Name = "Button1"
        Button1.Size = New Size(199, 23)
        Button1.TabIndex = 2
        Button1.Text = "Incarcare date"
        Button1.UseVisualStyleBackColor = True
        ' 
        ' Button2
        ' 
        Button2.Location = New Point(271, 53)
        Button2.Name = "Button2"
        Button2.Size = New Size(201, 23)
        Button2.TabIndex = 3
        Button2.Text = "Preluare date"
        Button2.UseVisualStyleBackColor = True
        ' 
        ' Button3
        ' 
        Button3.Location = New Point(273, 101)
        Button3.Name = "Button3"
        Button3.Size = New Size(199, 23)
        Button3.TabIndex = 4
        Button3.Text = "Preluare element selectat"
        Button3.UseVisualStyleBackColor = True
        ' 
        ' Button4
        ' 
        Button4.Location = New Point(273, 145)
        Button4.Name = "Button4"
        Button4.Size = New Size(199, 23)
        Button4.TabIndex = 5
        Button4.Text = "Sortare elemente"
        Button4.UseVisualStyleBackColor = True
        ' 
        ' Form1
        ' 
        AutoScaleDimensions = New SizeF(7F, 15F)
        AutoScaleMode = AutoScaleMode.Font
        ClientSize = New Size(800, 403)
        Controls.Add(Button4)
        Controls.Add(Button3)
        Controls.Add(Button2)
        Controls.Add(Button1)
        Controls.Add(ListBox2)
        Controls.Add(ListBox1)
        Name = "Form1"
        Text = "Preluare liste"
        ResumeLayout(False)
    End Sub

    Friend WithEvents ListBox1 As ListBox
    Friend WithEvents ListBox2 As ListBox
    Friend WithEvents Button1 As Button
    Friend WithEvents Button2 As Button
    Friend WithEvents Button3 As Button
    Friend WithEvents Button4 As Button

End Class
